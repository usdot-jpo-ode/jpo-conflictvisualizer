import React from 'react';
import BarChartComponent from './bar-chart-component';

interface StopLineStopGraphProps {
  data: { name: string; value: number }[];
  getInterval: (dataLength: number) => number;
}

const StopLineStopGraph: React.FC<StopLineStopGraphProps> = ({ data, getInterval }) => (
  <BarChartComponent
    title="Stop Line Stop Events Per Day"
    data={data}
    getInterval={getInterval}
    barColor="#8884d8"
  />
);

export default StopLineStopGraph;