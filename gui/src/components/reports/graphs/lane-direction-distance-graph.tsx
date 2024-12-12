import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from 'recharts';
import { Box, Typography } from '@mui/material';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import reportColorPalette from '../report-color-palette';

interface LaneDirectionDistanceGraphProps {
  data: { name: string; value: number }[];
  getInterval: (dataLength: number) => number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">events: {payload[0].value}</Typography>
      </Box>
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

const LaneDirectionDistanceGraph: React.FC<LaneDirectionDistanceGraphProps> = ({ data, getInterval }) => {
  // Convert the name property to a number
  const numericData = data.map(d => ({ ...d, name: Number(d.name) }));
  const minX = Math.min(...numericData.map(d => d.name));
  const maxX = Math.max(...numericData.map(d => d.name));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: 'auto' }}>
      <Box>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>Lane Direction Distance Distribution</Typography>
        <BarChart
          width={750}
          height={450}
          data={numericData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: 'Distance (ft)', position: 'insideBottom', offset: -10 }}
            scale="linear"
            type="number"
            domain={[minX - 0.5, maxX + 0.5]}
            interval={getInterval(data.length)}
          />
          <YAxis
            label={{ value: 'Event Count', angle: -90, position: 'insideLeft', offset: 0 }}
            tickFormatter={formatNumber}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={reportColorPalette[2]} />
        </BarChart>
      </Box>
    </Box>
  );
};

export default LaneDirectionDistanceGraph;