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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (report) {
      if (report.mapBroadcastRateEventCount) {
        const dateRange = generateDateRange(new Date(report.reportStartTime), new Date(report.reportStopTime));
        const eventCountMap = new Map(report.mapBroadcastRateEventCount.map((item: any) => [item.id, item.count]));
        const mergedData = dateRange.map(date => ({
          name: date,
          value: eventCountMap.get(date) || 0
        }));
        setMapBroadcastRateEventCount(mergedData);
      }
      if (report.mapMinimumDataEventCount) {
        const dateRange = generateDateRange(new Date(report.reportStartTime), new Date(report.reportStopTime));
        const eventCountMap = new Map(report.mapMinimumDataEventCount.map((item: any) => [item.id, item.count]));
        const mergedData = dateRange.map(date => ({
          name: date,
          value: eventCountMap.get(date) || 0
        }));
        setMapMinimumDataEventCount(mergedData);
      }
      if (report.timeChangeDetailsEventCount) {
        const dateRange = generateDateRange(new Date(report.reportStartTime), new Date(report.reportStopTime));
        const eventCountMap = new Map(report.timeChangeDetailsEventCount.map((item: any) => [item.id, item.count]));
        const mergedData = dateRange.map(date => ({
          name: date,
          value: eventCountMap.get(date) || 0
        }));
        setTimeChangeDetailsEventCount(mergedData);
      }
      if (report.spatMinimumDataEventCount) {
        const dateRange = generateDateRange(new Date(report.reportStartTime), new Date(report.reportStopTime));
        const eventCountMap = new Map(report.spatMinimumDataEventCount.map((item: any) => [item.id, item.count]));
        const mergedData = dateRange.map(date => ({
          name: date,
          value: eventCountMap.get(date) || 0
        }));
        setSpatMinimumDataEventCount(mergedData);
      }
      if (report.spatBroadcastRateEventCount) {
        const dateRange = generateDateRange(new Date(report.reportStartTime), new Date(report.reportStopTime));
        const eventCountMap = new Map(report.spatBroadcastRateEventCount.map((item: any) => [item.id, item.count]));
        const mergedData = dateRange.map(date => ({
          name: date,
          value: eventCountMap.get(date) || 0
        }));
        setSpatBroadcastRateEventCount(mergedData);
      }
      if (report.signalStateConflictEventCount) {
        const dateRange = generateDateRange(new Date(report.reportStartTime), new Date(report.reportStopTime));
        const eventCountMap = new Map(report.signalStateConflictEventCount.map((item: any) => [item.id, item.count]));
        const mergedData = dateRange.map(date => ({
          name: date,
          value: eventCountMap.get(date) || 0
        }));
        setSignalStateConflictEventCount(mergedData);
      }
      if (report.signalStateEventCounts) {
        const dateRange = generateDateRange(new Date(report.reportStartTime), new Date(report.reportStopTime));
        const eventCountMap = new Map(report.signalStateEventCounts.map((item: any) => [item.id, item.count]));
        const mergedData = dateRange.map(date => ({
          name: date,
          value: eventCountMap.get(date) || 0
        }));
        setSignalStateEventCounts(mergedData);
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
  pdf.text('Signal State Events', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  await captureGraph(pdf, 'signal-state-event-graph', { x: 0, y: 25 });
  setPdfDescriptionFormatting(pdf);
  pdf.text('The number of events triggered when vehicles passed through the intersection without stopping.',
    pdf.internal.pageSize.getWidth() / 2, pdfHeight / 2, { align: 'center' });
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
  if (report?.latestMapMinimumDataEventMissingElements) {
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
  if (report?.latestSpatMinimumDataEventMissingElements) {
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

              <Typography variant="h4" align="center" sx={{ mt: 4 }}>Signal State Events</Typography>

              <Box id="signal-state-event-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
                <StopLinePassageGraph data={signalStateEventCounts} getInterval={getInterval} />
              </Box>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of events triggered when vehicles passed through the intersection without stopping.
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

              {renderList('MAP Missing Data Elements', report.latestMapMinimumDataEventMissingElements)}

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

              {renderList('SPaT Missing Data Elements', report.latestSpatMinimumDataEventMissingElements)}
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