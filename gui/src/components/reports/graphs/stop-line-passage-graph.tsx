import React from 'react';
import BarChartComponent from './bar-chart-component';

interface SignalStateEventGraphProps {
  data: { name: string; value: number }[];
  getInterval: (dataLength: number) => number;
}

const StopLinePassageGraph: React.FC<SignalStateEventGraphProps> = ({ data, getInterval }) => (
  <BarChartComponent
    title="Stop Line Passage Events Per Day"
    data={data}
    getInterval={getInterval}
    barColor="#8884d8"
  />
);

export default StopLinePassageGraph;