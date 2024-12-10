import React from 'react';
import BarChartComponent from './bar-chart-component';

interface TimeChangeDetailsGraphProps {
  data: { name: string; value: number }[];
  getInterval: (dataLength: number) => number;
}

const TimeChangeDetailsGraph: React.FC<TimeChangeDetailsGraphProps> = ({ data, getInterval }) => (
  <BarChartComponent
    title="Time Change Details Events per Day"
    data={data}
    getInterval={getInterval}
    barColor="#8884d8"
  />
);

export default TimeChangeDetailsGraph;