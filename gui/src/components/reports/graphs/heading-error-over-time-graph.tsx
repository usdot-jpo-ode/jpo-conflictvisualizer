import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipProps } from 'recharts';
import { Box, Typography } from '@mui/material';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import reportColorPalette from '../report-color-palette'; // Import the color palette

interface HeadingErrorOverTimeGraphProps {
  data: LaneDirectionOfTravelAssessment[];
  laneNumber: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
        <Typography variant="body2">{label}</Typography>
        {payload.map((entry, index) => (
          <Typography key={`item-${index}`} variant="body2">{`${entry.name}: ${Number(entry.value).toFixed(1)}°`}</Typography>
        ))}
      </Box>
    );
  }

  return null;
};

const HeadingErrorOverTimeGraph: React.FC<HeadingErrorOverTimeGraphProps> = ({ data, laneNumber }) => {
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
      // Calculate heading delta and round to the nearest 0.5 degrees
      const headingDelta = Math.round((group.medianHeading - group.expectedHeading) * 2) / 2;
      if (!acc[minute][`Segment ${group.segmentID}`]) {
        acc[minute][`Segment ${group.segmentID}`] = [];
      }
      acc[minute][`Segment ${group.segmentID}`].push(headingDelta);
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
      acc[segment] = Math.round(average * 2) / 2; // Ensure the average is also rounded to the nearest 0.5 degrees
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

  const allValues = processedData.flatMap(d => Object.values(d).filter(value => typeof value === 'number').map(Number));
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const lines = segmentIDs.map((segmentID, index) => ({
    dataKey: `Segment ${segmentID}`,
    stroke: reportColorPalette[(index * 3 + 1) % reportColorPalette.length],
    name: `Segment ${segmentID}`
  }));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: 'auto' }}>
      <Box>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>{`Heading Error for Lane ${laneNumber} Over Time`}</Typography>
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
            label={{ value: 'Heading Delta (Degrees)', angle: -90, position: 'insideLeft', dy: 80 }}
            domain={[minValue - 1, maxValue + 1]} // Add 1 degree buffer to the top and bottom
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          {lines.map((line, index) => (
            <Line key={index} type="monotone" dataKey={line.dataKey} stroke={line.stroke} name={line.name} connectNulls dot={false} isAnimationActive={false} strokeWidth={2} />
          ))}
        </LineChart>
      </Box>
    </Box>
  );
};

export default HeadingErrorOverTimeGraph;