// SignalStateConflictGraph.tsx
import React from 'react';
import BarChartComponent from './bar-chart-component';

interface SignalStateConflictGraphProps {
  data: { name: string; value: number }[];
  getInterval: (dataLength: number) => number;
}

const SignalStateConflictGraph: React.FC<SignalStateConflictGraphProps> = ({ data, getInterval }) => (
  <BarChartComponent
    title="Signal State Conflict Events per Day"
    data={data}
    getInterval={getInterval}
    barColor="#8884d8"
  />
);

export default SignalStateConflictGraph;