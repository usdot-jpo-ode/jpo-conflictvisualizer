import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, IconButton, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReportMetadata } from '../../apis/reports-api';
import { format, eachDayOfInterval } from 'date-fns';
import SignalStateConflictGraph from './graphs/signal-state-conflict-graph';
import TimeChangeDetailsGraph from './graphs/time-change-details-graph';
import MapBroadcastRateGraph from './graphs/map-broadcast-rate-graph';
import MapMinimumDataGraph from './graphs/map-minimum-data-graph';
import SpatBroadcastRateGraph from './graphs/spat-broadcast-rate-graph';
import SpatMinimumDataGraph from './graphs/spat-minimum-data-graph';
import StopLinePassageGraph from './graphs/stop-line-passage-graph';
import StopLineStopGraph from './graphs/stop-line-stop-graph';
import ConnectionOfTravelGraph from './graphs/connection-of-travel-event-count-graph';
import LaneDirectionOfTravelGraph from './graphs/lane-direction-of-travel-event-count-graph';
import LaneDirectionDistanceGraph from './graphs/lane-direction-distance-graph';
import LaneDirectionHeadingGraph from './graphs/lane-direction-heading-graph';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportDetailsModalProps {
  open: boolean;
  onClose: () => void;
  report: ReportMetadata | null;
}

const ReportDetailsModal = ({ open, onClose, report }: ReportDetailsModalProps) => {
  const [mapBroadcastRateEventCount, setMapBroadcastRateEventCount] = useState<{ name: string; value: number }[]>([]);
  const [mapMinimumDataEventCount, setMapMinimumDataEventCount] = useState<{ name: string; value: number }[]>([]);
  const [timeChangeDetailsEventCount, setTimeChangeDetailsEventCount] = useState<{ name: string; value: number }[]>([]);
  const [spatMinimumDataEventCount, setSpatMinimumDataEventCount] = useState<{ name: string; value: number }[]>([]);
  const [spatBroadcastRateEventCount, setSpatBroadcastRateEventCount] = useState<{ name: string; value: number }[]>([]);
  const [signalStateConflictEventCount, setSignalStateConflictEventCount] = useState<{ name: string; value: number }[]>([]);
  const [signalStateEventCounts, setSignalStateEventCounts] = useState<{ name: string; value: number }[]>([]);
  const [stopLineStopEventCounts, setStopLineStopEventCounts] = useState<{ name: string; value: number }[]>([]);
  const [connectionOfTravelEventCounts, setConnectionOfTravelEventCounts] = useState<{ name: string; value: number }[]>([]);
  const [laneDirectionOfTravelEventCounts, setLaneDirectionOfTravelEventCounts] = useState<{ name: string; value: number }[]>([]);
  const [laneDirectionDistanceDistribution, setLaneDirectionDistanceDistribution] = useState<{ name: string; value: number }[]>([]);
  const [laneDirectionHeadingDistribution, setLaneDirectionHeadingDistribution] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const generateMergedData = (eventCounts: { id: string; count: number }[], dateRange: string[]) => {
    const eventCountMap = new Map(eventCounts.map((item: any) => [item.id, item.count]));
    return dateRange.map(date => ({
      name: date,
      value: eventCountMap.get(date) || 0
    }));
  };

  useEffect(() => {
    if (report) {
      const dateRange = generateDateRange(new Date(report.reportStartTime), new Date(report.reportStopTime));
  
      const eventCounts = [
        { data: report.mapBroadcastRateEventCount, setter: setMapBroadcastRateEventCount },
        { data: report.mapMinimumDataEventCount, setter: setMapMinimumDataEventCount },
        { data: report.timeChangeDetailsEventCount, setter: setTimeChangeDetailsEventCount },
        { data: report.spatMinimumDataEventCount, setter: setSpatMinimumDataEventCount },
        { data: report.spatBroadcastRateEventCount, setter: setSpatBroadcastRateEventCount },
        { data: report.signalStateConflictEventCount, setter: setSignalStateConflictEventCount },
        { data: report.signalStateEventCounts, setter: setSignalStateEventCounts },
        { data: report.signalStateStopEventCounts, setter: setStopLineStopEventCounts },
        { data: report.connectionOfTravelEventCounts, setter: setConnectionOfTravelEventCounts },
        { data: report.laneDirectionOfTravelEventCounts, setter: setLaneDirectionOfTravelEventCounts },
      ];
  
      eventCounts.forEach(({ data, setter }) => {
        if (data) {
          setter(generateMergedData(data, dateRange));
        }
      });
  
      // Set state for lane direction distance and heading distributions directly
      if (report.laneDirectionOfTravelMedianDistanceDistribution) {
        setLaneDirectionDistanceDistribution(report.laneDirectionOfTravelMedianDistanceDistribution.map(item => ({
          name: item.id,
          value: item.count
        })));
      }
  
      if (report.laneDirectionOfTravelMedianHeadingDistribution) {
        setLaneDirectionHeadingDistribution(report.laneDirectionOfTravelMedianHeadingDistribution.map(item => ({
          name: item.id,
          value: item.count
        })));
      }
    }
  }, [report]);

  const getInterval = (dataLength: number) => {
    return dataLength <= 15 ? 0 : Math.ceil(dataLength / 30);
  };

  const setPdfSectionTitleFormatting = (pdf: jsPDF) => {
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
  };

  const setPdfDescriptionFormatting = (pdf: jsPDF) => {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
  };

  const setPdfBodyFormatting = (pdf: jsPDF) => {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
  };

  const setPdfItemTitleFormatting = (pdf: jsPDF) => {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
  };

  const captureGraph = async (pdf: jsPDF, elementId: string, position: { x: number, y: number }) => {
    const input = document.getElementById(elementId);
    if (input) {
      const canvas = await html2canvas(input);
      input.style.width = '';
      input.style.height = '';
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 30;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', position.x + 15, position.y, imgWidth, imgHeight);
    }
  };
  
const generatePdf = async () => {
  setLoading(true);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const pdfWidth = pdf.internal.pageSize.getWidth();

  pdf.setFontSize(36);
  pdf.text('Conflict Monitor Report', pdfWidth / 2, pdfHeight / 2 - 50, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`${report?.reportStartTime ? format(new Date(report.reportStartTime), "yyyy-MM-dd' T'HH:mm:ss'Z'") : ''} - ${report?.reportStopTime ? format(new Date(report.reportStopTime), "yyyy-MM-dd' T'HH:mm:ss'Z'") : ''}`,
    pdfWidth / 2, pdfHeight / 2 - 30, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  pdf.text('Lane Direction of Travel', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  await captureGraph(pdf, 'lane-direction-of-travel-graph', { x: 0, y: 25 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of events triggered when vehicles passed a lane segment.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2 - 10, { align: 'center' });

  await captureGraph(pdf, 'lane-direction-distance-graph', { x: 0, y: pdfHeight / 2 + 10 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The median deviation in distance between vehicles and the center of the lane as defined by the MAP.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  await captureGraph(pdf, 'lane-direction-heading-graph', { x: 0, y: 25 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The median deviation in heading between vehicles and the lanes as defined by the MAP.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  pdf.text('Connection of Travel', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  await captureGraph(pdf, 'connection-of-travel-graph', { x: 0, y: 25 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of events triggered when vehicles passed through the intersection.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  pdf.text('Signal State Events', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  await captureGraph(pdf, 'signal-state-event-graph', { x: 0, y: 25 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of events triggered when vehicles passed the stop line.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });

  await captureGraph(pdf, 'stop-line-stop-graph', { x: 0, y: pdfHeight / 2 + 10 });
  pdf.text('The number of events triggered when vehicles stopped at the stop line.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  await captureGraph(pdf, 'signal-state-conflict-graph', { x: 0, y: 25 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of times the system detected contradictory signal states, such as two perpendicular green lights.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  await captureGraph(pdf, 'time-change-details-graph', { x: 0, y: pdfHeight / 2 + 10 });
  pdf.text('The number of times the system detected differences in timing between expected and actual signal state changes.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  setPdfItemTitleFormatting(pdf);
  pdf.text('MAP', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  await captureGraph(pdf, 'map-broadcast-rate-graph', { x: 0, y: 25 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of times the system flagged more or less frequent MAP broadcasts than the expected rate of 1 Hz.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  await captureGraph(pdf, 'map-minimum-data-graph', { x: 0, y: pdfHeight / 2 + 10 });
  pdf.text('The number of times the system flagged MAP messages with missing or incomplete data.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  setPdfItemTitleFormatting(pdf);
  pdf.text('MAP Missing Data Elements', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  setPdfBodyFormatting(pdf);
  if (report?.latestMapMinimumDataEventMissingElements?.length) {
    let yOffset = 30;
    report.latestMapMinimumDataEventMissingElements.forEach((element) => {
      const lines = pdf.splitTextToSize(element, pdf.internal.pageSize.getWidth() - 40);
      pdf.text(lines, 20, yOffset);
      yOffset += lines.length * 7; // Adjust yOffset based on the number of lines, reduced spacing
    });
  }
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  pdf.text('SPaT', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  await captureGraph(pdf, 'spat-broadcast-rate-graph', { x: 0, y: 25 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of times the system flagged more or less frequent SPaT broadcasts than the expected rate of 10 Hz.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
  await captureGraph(pdf, 'spat-minimum-data-graph', { x: 0, y: pdfHeight / 2 + 10 });
  pdf.text('The number of times the system flagged SPaT messages with missing or incomplete data.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight - 15, { align: 'center' });
  pdf.addPage();

  setPdfSectionTitleFormatting(pdf);
  pdf.text('SPaT Missing Data Elements', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  setPdfBodyFormatting(pdf);
  if (report?.latestSpatMinimumDataEventMissingElements?.length) {
    let yOffset = 30;
    report.latestSpatMinimumDataEventMissingElements.forEach((element) => {
      const lines = pdf.splitTextToSize(element, pdf.internal.pageSize.getWidth() - 40);
      pdf.text(lines, 20, yOffset);
      yOffset += lines.length * 7; // Adjust yOffset based on the number of lines, reduced spacing
    });
  }

  pdf.save(report?.reportName + ".pdf" || 'report.pdf');
  setLoading(false);
};

const renderList = (title: string, data: string[]) => (
  data.length > 0 && (
    <>
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>{title}</Typography>
      <Box sx={{ mt: 2 }}>
        {data.map((element, index) => (
          <Typography key={index} variant="body1" sx={{ mb: 1 }}>
            {element}
          </Typography>
        ))}
      </Box>
    </>
  )
);

return (
  <Modal open={open} onClose={onClose}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box sx={{ position: 'relative', p: 4, backgroundColor: 'white', margin: 'auto', width: '820px', maxHeight: '90vh', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
          <Button onClick={generatePdf} variant="contained" color="primary" disabled={loading} sx={{ mt: -2, ml: -2 }}>
            {loading ? <CircularProgress size={24} /> : 'Download PDF'}
          </Button>
        </Box>
        {!report ? (
          <Typography>No report found</Typography>
        ) : (
          <>
            <Typography variant="h3" align="center">Conflict Monitor Report</Typography>
            <Typography variant="body1" align="center">
              {`${format(new Date(report.reportStartTime), "yyyy-MM-dd' T'HH:mm:ss'Z'")} - ${format(new Date(report.reportStopTime), "yyyy-MM-dd' T'HH:mm:ss'Z'")}`}
            </Typography>

            <Typography variant="h4" align="center" sx={{ mt: 4 }}>Lane Direction of Travel</Typography>

            <Box id="lane-direction-of-travel-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <LaneDirectionOfTravelGraph data={laneDirectionOfTravelEventCounts} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of events triggered when vehicles passed a lane segment.
            </Typography>

            <Box id="lane-direction-distance-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <LaneDirectionDistanceGraph data={laneDirectionDistanceDistribution} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The median deviation in distance between vehicles and the center of the lane as defined by the MAP.
            </Typography>

            <Box id="lane-direction-heading-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <LaneDirectionHeadingGraph data={laneDirectionHeadingDistribution} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The median deviation in heading between vehicles and the lanes as defined by the MAP.
            </Typography>

            <Typography variant="h4" align="center" sx={{ mt: 4 }}>Connection of Travel</Typography>

            <Box id="connection-of-travel-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <ConnectionOfTravelGraph data={connectionOfTravelEventCounts} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of events triggered when vehicles passed through the intersection.
            </Typography>

            <Typography variant="h4" align="center" sx={{ mt: 4 }}>Signal State Events</Typography>

            <Box id="signal-state-event-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <StopLinePassageGraph data={signalStateEventCounts} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of events triggered when vehicles entered the intersection.
            </Typography>

            <Box id="stop-line-stop-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <StopLineStopGraph data={stopLineStopEventCounts} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of events triggered when vehicles stopped before passing through the intersection.
            </Typography>

            <Box id="signal-state-conflict-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <SignalStateConflictGraph data={signalStateConflictEventCount} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of times the system detected contradictory signal states, such as two perpendicular green lights.
            </Typography>

            <Box id="time-change-details-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <TimeChangeDetailsGraph data={timeChangeDetailsEventCount} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of times the system detected differences in timing between expected and actual signal state changes.
            </Typography>

            <Typography variant="h4" align="center" sx={{ mt: 4 }}>MAP</Typography>

            <Box id="map-broadcast-rate-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <MapBroadcastRateGraph data={mapBroadcastRateEventCount} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of times the system flagged more or less frequent MAP broadcasts than the expected rate of 1 Hz.
            </Typography>

            <Box id="map-minimum-data-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <MapMinimumDataGraph data={mapMinimumDataEventCount} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of times the system flagged MAP messages with missing or incomplete data.
            </Typography>

            {report.latestMapMinimumDataEventMissingElements?.length > 0 && renderList('MAP Missing Data Elements', report.latestMapMinimumDataEventMissingElements)}

            <Typography variant="h4" align="center" sx={{ mt: 4 }}>SPaT</Typography>

            <Box id="spat-broadcast-rate-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <SpatBroadcastRateGraph data={spatBroadcastRateEventCount} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of times the system flagged more or less frequent SPaT broadcasts than the expected rate of 10 Hz.
            </Typography>

            <Box id="spat-minimum-data-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
              <SpatMinimumDataGraph data={spatMinimumDataEventCount} getInterval={getInterval} />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
              The number of times the system flagged SPaT messages with missing or incomplete data.
            </Typography>

            {report.latestSpatMinimumDataEventMissingElements?.length > 0 && renderList('SPaT Missing Data Elements', report.latestSpatMinimumDataEventMissingElements)}
          </>
        )}
      </Box>
    </Box>
  </Modal>
);
};

export default ReportDetailsModal;

// Utility function to generate date range
function generateDateRange(startDate: Date, endDate: Date): string[] {
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  return dates.map(date => format(date, 'yyyy-MM-dd'));
}