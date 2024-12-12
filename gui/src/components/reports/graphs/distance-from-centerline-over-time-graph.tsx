import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipProps } from 'recharts';
import { Box, Typography } from '@mui/material';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import reportColorPalette from '../report-color-palette'; // Import the color palette

interface DistanceFromCenterlineOverTimeGraphProps {
  data: LaneDirectionOfTravelAssessment[];
  laneNumber: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
        <Typography variant="body2">{label}</Typography>
        {payload.map((entry, index) => (
          <Typography key={`item-${index}`} variant="body2">{`${entry.name}: ${Number(entry.value).toFixed(2)} cm`}</Typography>
        ))}
      </Box>
    );
  }

  return null;
};

const DistanceFromCenterlineOverTimeGraph: React.FC<DistanceFromCenterlineOverTimeGraphProps> = ({ data, laneNumber }) => {
  // Sort data by timestamp in ascending order
  const sortedData = data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Extract unique segment IDs for the lines
  const segmentIDs = Array.from(new Set(data.flatMap(assessment => assessment.laneDirectionOfTravelAssessmentGroup.map(group => group.segmentID))));

  // Aggregate data by minute
  const aggregatedData = sortedData.reduce((acc, assessment) => {
    const date = new Date(assessment.timestamp);
    const minute = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).getTime();
    if (!acc[minute]) {
      acc[minute] = {};
    }
    assessment.laneDirectionOfTravelAssessmentGroup.forEach(group => {
      if (!acc[minute][`Segment ${group.segmentID}`]) {
        acc[minute][`Segment ${group.segmentID}`] = [];
      }
      acc[minute][`Segment ${group.segmentID}`].push(group.medianCenterlineDistance);
    });
    return acc;
  }, {} as { [minute: number]: { [segment: string]: number[] } });

  // Process aggregated data to calculate the average for each segment per minute
  const processedData = Object.keys(aggregatedData).map(minute => {
    const date = new Date(Number(minute));
    const formattedDate = `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    const segments = Object.keys(aggregatedData[minute]).reduce((acc, segment) => {
      const values = aggregatedData[minute][segment];
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      acc[segment] = average;
      return acc;
    }, { name: formattedDate });
    return segments;
  });

  // Custom tick formatter for the x-axis
  const uniqueDates = Array.from(new Set(processedData.map(d => d.name.split(' ')[0])));
  const tickFormatter = (tick: string) => {
    const date = new Date(Date.parse(tick));
    if (uniqueDates.length <= 5) {
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  };

  const lines = segmentIDs.map((segmentID, index) => ({
    dataKey: `Segment ${segmentID}`,
    stroke: reportColorPalette[(index * 3) % reportColorPalette.length],
    name: `Segment ${segmentID}`
  }));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: 'auto' }}>
      <Box>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>{`Distance From Lane ${laneNumber} Centerline Over Time`}</Typography>
        <LineChart
          width={750}
          height={450}
          data={processedData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: 'Time', position: 'insideBottom', offset: -60 }}
            tickFormatter={tickFormatter}
            angle={-45}
            textAnchor="end"
          />
          <YAxis
            label={{ value: 'Distance from Centerline (cm)', angle: -90, position: 'insideLeft', dy: 80 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          {lines.map((line, index) => (
            <Line key={index} type="monotone" dataKey={line.dataKey} stroke={line.stroke} name={line.name} connectNulls dot={false} />
          ))}
        </LineChart>
      </Box>
    </Box>
  );
};

export default DistanceFromCenterlineOverTimeGraph;