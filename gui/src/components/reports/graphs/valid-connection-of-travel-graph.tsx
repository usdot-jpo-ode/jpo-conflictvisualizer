import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from 'recharts';
import { Box, Typography } from '@mui/material';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import reportColorPalette from '../report-color-palette';

interface ValidConnectionOfTravelGraphProps {
  data: ConnectionOfTravelAssessment[];
}

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const obj = payload[0].payload;
    return (
      <Box sx={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
        <Typography variant="body2">Connection ID: {obj.connectionID}</Typography>
        <Typography variant="body2">Ingress Lane ID: {obj.ingressLaneID}</Typography>
        <Typography variant="body2">Egress Lane ID: {obj.egressLaneID}</Typography>
        <Typography variant="body2">Event Count: {obj.eventCountValid}</Typography>
      </Box>
    );
  }
  return null;
};

const ValidConnectionOfTravelGraph: React.FC<ValidConnectionOfTravelGraphProps> = ({ data }) => {
  // Aggregate data by ingress and egress lane IDs
  const aggregatedData = data.reduce((acc, assessment) => {
    assessment.connectionOfTravelAssessmentGroups.forEach(group => {
      const key = `${group.ingressLaneID}-${group.egressLaneID}`;
      if (!acc[key]) {
        acc[key] = {
          connectionID: group.connectionID,
          ingressLaneID: group.ingressLaneID,
          egressLaneID: group.egressLaneID,
          eventCountValid: 0,
          eventCountInvalid: 0,
        };
      }
      if (group.connectionID !== -1) {
        acc[key].eventCountValid += group.eventCount;
      } else {
        acc[key].eventCountInvalid += group.eventCount;
      }
    });
    return acc;
  }, {} as { [key: string]: any });

  // Convert aggregated data to an array and filter out zero event counts
  const processedData = Object.values(aggregatedData).filter(item => item.eventCountValid > 0);

  const sortByName = (a, b) => {
    if (a.ingressLaneID < b.ingressLaneID) {
      return -1;
    }
    if (a.ingressLaneID > b.ingressLaneID) {
      return 1;
    }
    if (a.egressLaneID < b.egressLaneID) {
      return -1;
    }
    if (a.egressLaneID > b.egressLaneID) {
      return 1;
    }
    return 0;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: 'auto' }}>
      <Box>
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>Valid Connection of Travel</Typography>
        <BarChart
          width={750}
          height={450}
          data={processedData.sort(sortByName)}
          margin={{
            top: 20, right: 30, left: 20, bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="ingressLaneID"
            interval={0}
            angle={-45}
            height={50}
            textAnchor="end"
            label={{ value: 'Ingress - Egress Lane ID', position: 'center', dy: 40 }}
            tickFormatter={(tick, index) => `${processedData[index].ingressLaneID} - ${processedData[index].egressLaneID}`}
          />
          <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="eventCountValid" fill={reportColorPalette[8]} />
        </BarChart>
      </Box>
    </Box>
  );
};

export default ValidConnectionOfTravelGraph;