import { useEffect, useState } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ReportMetadata } from '../../apis/reports-api';
import { format, eachDayOfInterval } from 'date-fns';

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
    }
  }, [report]);

  const getInterval = (dataLength: number) => {
    return dataLength <= 15 ? 0 : Math.ceil(dataLength / 15);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box sx={{ position: 'relative', p: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {!report ? (
            <Typography>No report found</Typography>
          ) : (
            <>
              <Typography variant="h3" align="center">Conflict Monitor Report</Typography>
              <Typography variant="body1" align="center">
                {`${format(new Date(report.reportStartTime), "yyyy-MM-dd'T'HH:mm:ss'Z'")} - ${format(new Date(report.reportStopTime), "yyyy-MM-dd'T'HH:mm:ss'Z'")}`}
              </Typography>
              <Typography variant="h4" align="center" sx={{ mt: 4 }}>Signal State Events</Typography>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>Signal State Conflict Event Count</Typography>
              <BarChart
                width={500}
                height={300}
                data={signalStateConflictEventCount}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -60 }} angle={-45} textAnchor="end" interval={getInterval(signalStateConflictEventCount.length)} />
                <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft', offset: 0 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of times the system detected contradictory signal states, such as two perpendicular green lights.
              </Typography>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>Time Change Details Event Count</Typography>
              <BarChart
                width={500}
                height={300}
                data={timeChangeDetailsEventCount}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -60 }} angle={-45} textAnchor="end" interval={getInterval(timeChangeDetailsEventCount.length)} />
                <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft', offset: 0 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of times the system detected differences in timing between expected and actual signal state changes.
              </Typography>
              <Typography variant="h4" align="center" sx={{ mt: 4 }}>MAP</Typography>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>Map Broadcast Rate Event Count</Typography>
              <BarChart
                width={500}
                height={300}
                data={mapBroadcastRateEventCount}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -60 }} angle={-45} textAnchor="end" interval={getInterval(mapBroadcastRateEventCount.length)} />
                <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft', offset: 0 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of times the system flagged more or less frequent MAP broadcasts than the expected rate of 1 Hz.
              </Typography>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>Map Minimum Data Event Count</Typography>
              <BarChart
                width={500}
                height={300}
                data={mapMinimumDataEventCount}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -60 }} angle={-45} textAnchor="end" interval={getInterval(mapMinimumDataEventCount.length)} />
                <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft', offset: 0 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of times the system flagged MAP messages with missing or incomplete data.
              </Typography>
              <Typography variant="h4" align="center" sx={{ mt: 4 }}>SPaT</Typography>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>SPaT Broadcast Rate Event Count</Typography>
              <BarChart
                width={500}
                height={300}
                data={spatBroadcastRateEventCount}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -60 }} angle={-45} textAnchor="end" interval={getInterval(spatBroadcastRateEventCount.length)} />
                <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft', offset: 0 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of times the system flagged more or less frequent SPaT broadcasts than the expected rate of 10 Hz.
              </Typography>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>SPaT Minimum Data Event Count</Typography>
              <BarChart
                width={500}
                height={300}
                data={spatMinimumDataEventCount}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -60 }} angle={-45} textAnchor="end" interval={getInterval(spatMinimumDataEventCount.length)} />
                <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft', offset: 0 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
              <Typography variant="body2" align="center" sx={{ mt: 0.5, mb: 6, fontStyle: 'italic' }}>
                The number of times the system flagged SPaT messages with missing or incomplete data.
              </Typography>
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