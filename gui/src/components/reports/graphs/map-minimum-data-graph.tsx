// MapMinimumDataGraph.tsx
import React from 'react';
import BarChartComponent from './bar-chart-component';

interface MapMinimumDataGraphProps {
  data: { name: string; value: number }[];
  getInterval: (dataLength: number) => number;
}

const MapMinimumDataGraph: React.FC<MapMinimumDataGraphProps> = ({ data, getInterval }) => (
  <BarChartComponent
    title="MAP Minimum Data Events per Day"
    data={data}
    getInterval={getInterval}
    barColor="#82ca9d"
  />
);

export default MapMinimumDataGraph;