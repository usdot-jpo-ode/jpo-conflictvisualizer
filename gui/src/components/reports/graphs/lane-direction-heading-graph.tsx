import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, ReferenceLine, ReferenceArea } from 'recharts';
import { Box, Typography } from '@mui/material';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import reportColorPalette from '../report-color-palette';

interface LaneDirectionHeadingGraphProps {
  data: { name: string; value: number }[];
  getInterval: (dataLength: number) => number;
  headingTolerance: number; // New prop
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
        <div>{label}</div>
        <div>events: {payload[0].value}</div>
      </div>
    );
  }

  return null;
};

// Utility function to format numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

// Normalize heading values to the range of -180 to 180 degrees
const normalizeHeading = (heading: number) => {
  if (heading < -180) {
    return heading + 360;
  } else if (heading > 180) {
    return heading - 360;
  }
  return heading;
};

// Calculate the mean of the data
const calculateMean = (data: { name: number; value: number }[]) => {
  const total = data.reduce((sum, item) => sum + item.name * item.value, 0);
  const count = data.reduce((sum, item) => sum + item.value, 0);
  return total / count;
};

// Calculate the median of the data
const calculateMedian = (data: { name: number; value: number }[]) => {
  const totalCount = data.reduce((sum, item) => sum + item.value, 0);
  const halfCount = totalCount / 2;
  let cumulativeCount = 0;

  for (const item of data) {
    cumulativeCount += item.value;
    if (cumulativeCount >= halfCount) {
      return item.name;
    }
  }
  return 0; // Default return value if something goes wrong
};

const calculatePercentageOutsideTolerance = (data: { name: number; value: number }[], tolerance: number) => {
  const totalEvents = data.reduce((sum, item) => sum + item.value, 0);
  const outsideToleranceEvents = data.reduce((sum, item) => {
    if (Math.abs(item.name) > tolerance) {
      return sum + item.value;
    }
    return sum;
  }, 0);
  return (outsideToleranceEvents / totalEvents) * 100;
};

const LaneDirectionHeadingGraph: React.FC<LaneDirectionHeadingGraphProps> = ({ data, getInterval, headingTolerance }) => {
  // Convert the name property to a number and normalize the heading values
  const numericData = data
    .map(d => ({ ...d, name: normalizeHeading(Number(d.name)) }))
    .sort((a, b) => a.name - b.name);

  // Calculate the mean, median, min, and max
  const mean = Math.round(calculateMean(numericData));
  const median = Math.round(calculateMedian(numericData));
  const min = Math.round(Math.min(...numericData.map(d => d.name)));
  const max = Math.round(Math.max(...numericData.map(d => d.name)));
  const percentageOutsideTolerance = calculatePercentageOutsideTolerance(numericData, headingTolerance);
  const domainMin = Math.max(Math.floor(min / 10) * 10, -180);
  const domainMax = Math.min(Math.ceil(max / 10) * 10, 180);

  const tickFormatter = (tick: number) => `${tick}°`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: 'auto' }}>
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>Lane Direction Heading Distribution</Typography>
      <BarChart
        width={750}
        height={450}
        data={numericData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 15,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          label={{ value: 'Heading (degrees)', position: 'insideBottom', offset: -10 }}
          type="number"
          domain={[domainMin, domainMax]}
          tickFormatter={tickFormatter}
        />
        <YAxis
          label={{ value: 'Event Count', angle: -90, position: 'insideLeft', offset: 0 }}
          tickFormatter={(value) => `${formatNumber(value)}°`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill={reportColorPalette[9]} />
        <ReferenceLine x={mean} stroke={reportColorPalette[4]} />
        <ReferenceLine x={median} stroke={reportColorPalette[7]} />
        <ReferenceLine x={headingTolerance} stroke={reportColorPalette[0]} strokeDasharray="3 3" />
        <ReferenceLine x={-headingTolerance} stroke={reportColorPalette[0]} strokeDasharray="3 3" />
        <ReferenceArea x1={headingTolerance} x2={domainMax} fill={reportColorPalette[3]} fillOpacity={0.1} />
        <ReferenceArea x1={domainMin} x2={-headingTolerance} fill={reportColorPalette[3]} fillOpacity={0.1} />
        </BarChart>
      {data.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ color: reportColorPalette[3], mx: 1 }}>Mean: {mean}°</Typography>
          <Typography variant="body2" sx={{ color: reportColorPalette[7], mx: 1 }}>Median: {median}°</Typography>
          <Typography variant="body2" sx={{ color: reportColorPalette[0], mx: 1 }}>Tolerance: {headingTolerance}°</Typography>
          <Typography variant="body2" sx={{ mx: 1 }}>Out-of-Tolerance Events: {percentageOutsideTolerance.toFixed(2)}%</Typography>
          <Typography variant="body2" sx={{ mx: 1 }}>Min: {min}°</Typography>
          <Typography variant="body2" sx={{ mx: 1 }}>Max: {max}°</Typography>
        </Box>
      )}
    </Box>
  );
};

export default LaneDirectionHeadingGraph;