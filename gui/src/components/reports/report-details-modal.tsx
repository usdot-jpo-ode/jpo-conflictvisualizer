import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, IconButton, Button, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReportMetadata } from '../../apis/reports-api';
import { format } from 'date-fns';
import SignalStateConflictGraph from './graphs/signal-state-conflict-graph';
import TimeChangeDetailsGraph from './graphs/time-change-details-graph';
import MapBroadcastRateGraph from './graphs/map-broadcast-rate-graph';
import MapMinimumDataGraph from './graphs/map-minimum-data-graph';
import SpatBroadcastRateGraph from './graphs/spat-broadcast-rate-graph';
import SpatMinimumDataGraph from './graphs/spat-minimum-data-graph';
import StopLinePassageGraph from './graphs/stop-line-passage-graph';
import StopLineStopGraph from './graphs/stop-line-stop-graph';
import ConnectionOfTravelGraph from './graphs/connection-of-travel-event-count-graph';
import ValidConnectionOfTravelGraph from './graphs/valid-connection-of-travel-graph';
import InvalidConnectionOfTravelGraph from './graphs/invalid-connection-of-travel-graph';
import LaneDirectionOfTravelGraph from './graphs/lane-direction-of-travel-event-count-graph';
import LaneDirectionDistanceGraph from './graphs/lane-direction-distance-graph';
import LaneDirectionHeadingGraph from './graphs/lane-direction-heading-graph';
import IntersectionReferenceAlignmentGraph from './graphs/intersection-reference-alignment-graph';
import DistanceFromCenterlineGraphSet from './graphs/distance-from-centerline-graph-set';
import HeadingErrorGraphSet from './graphs/heading-error-graph-set';
import { generatePdf } from './pdf-generator';
import { generateDateRange } from './report-utils';

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
  const [intersectionReferenceAlignmentEventCounts, setIntersectionReferenceAlignmentEventCounts] = useState<{ name: string; value: number }[]>([]);
  const [distanceFromCenterlineOverTimeData, setDistanceFromCenterlineOverTimeData] = useState<LaneDirectionOfTravelAssessment[]>([]);
  const [headingErrorOverTimeData, setHeadingErrorOverTimeData] = useState<LaneDirectionOfTravelAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeLaneSpecificCharts, setIncludeLaneSpecificCharts] = useState(false); // Default to unchecked

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
        { data: report.intersectionReferenceAlignmentEventCounts, setter: setIntersectionReferenceAlignmentEventCounts },
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

      // Set state for distance from centerline over time data
      if (report.laneDirectionOfTravelAssessmentCount) {
        setDistanceFromCenterlineOverTimeData(report.laneDirectionOfTravelAssessmentCount);
        setHeadingErrorOverTimeData(report.laneDirectionOfTravelAssessmentCount);
      }
    }
  }, [report]);

  const getInterval = (dataLength: number) => {
    return dataLength <= 15 ? 0 : Math.ceil(dataLength / 30);
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

  const handleGeneratePdf = async () => {
    if (report) {
      setLoading(true);
      await generatePdf(report, setLoading, includeLaneSpecificCharts, () => open);
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box sx={{ position: 'relative', p: 4, backgroundColor: 'white', margin: 'auto', width: '820px', maxHeight: '90vh', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} >
              <CloseIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={handleGeneratePdf} variant="contained" color="primary" disabled={loading} sx={{ mt: -2, ml: -2 }}>
                {loading ? <CircularProgress size={24} /> : 'Download PDF'}
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeLaneSpecificCharts}
                    onChange={(e) => setIncludeLaneSpecificCharts(e.target.checked)}
                    color="primary"
                    disabled={loading} // Disable the checkbox while loading
                  />
                }
                label="Include lane-specific charts"
                sx={{ mt: -2, ml: 2 }}
              />
            </Box>
          </Box>
          {!report ? (
            <Typography>No report found</Typography>
          ) : (
            <>
              <Typography variant="h3" align="center">Conflict Monitor Report</Typography>
              <Typography variant="body1" align="center">
                {`${format(new Date(report.reportStartTime), "yyyy-MM-dd' T'HH:mm:ss'Z'")}`}
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

              {includeLaneSpecificCharts && (
                <>
                  <Typography variant="h4" align="center" sx={{ mt: 4 }}>Distance From Centerline Over Time</Typography>
                  <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                    The average of median distances between vehicles and the centerline of each lane as it changed over time.
                  </Typography>
                  <Box id="distance-from-centerline-over-time-graphs" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <DistanceFromCenterlineGraphSet data={distanceFromCenterlineOverTimeData} />
                  </Box>

                  <Typography variant="h4" align="center" sx={{ mt: 4 }}>Vehicle Heading Error Delta</Typography>
                  <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                    The median deviation in heading between vehicles and the expected heading as defined by the MAP.
                  </Typography>
                  <Box id="heading-error-over-time-graphs" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <HeadingErrorGraphSet data={headingErrorOverTimeData} />
                  </Box>
                </>
              )}

              <Typography variant="h4" align="center" sx={{ mt: 4 }}>Connection of Travel</Typography>

              <Box id="connection-of-travel-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
                <ConnectionOfTravelGraph data={connectionOfTravelEventCounts} getInterval={getInterval} />
              </Box>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of events triggered when vehicles passed through the intersection.
              </Typography>

              <Box id="valid-connection-of-travel-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
                <ValidConnectionOfTravelGraph data={report.connectionOfTravelAssessmentCount} />
              </Box>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of vehicles that followed the defined ingress-egress lane pairings for each lane at the intersection.
              </Typography>
              
              <Box id="invalid-connection-of-travel-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
                <InvalidConnectionOfTravelGraph data={report.connectionOfTravelAssessmentCount} />
              </Box>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of vehicles that did not follow the defined ingress-egress lane pairings for each lane at the intersection.
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

              <Typography variant="h4" align="center" sx={{ mt: 4 }}>Intersection Reference Alignments Per Day</Typography>

              <Box id="intersection-reference-alignment-graph" sx={{ display: 'flex', justifyContent: 'center' }}>
                <IntersectionReferenceAlignmentGraph data={intersectionReferenceAlignmentEventCounts} getInterval={getInterval} />
              </Box>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of events flagging a mismatch between intersection ID and road regulator ID.
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