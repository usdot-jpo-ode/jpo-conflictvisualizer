import React from 'react';
import { Box, Typography } from '@mui/material';
import DistanceFromCenterlineOverTimeGraph from './distance-from-centerline-over-time-graph';
import { extractLaneIds, LaneDirectionOfTravelReportData } from '../report-utils';

interface DistanceFromCenterlineGraphSetProps {
  data: LaneDirectionOfTravelReportData[];
}

const DistanceFromCenterlineGraphSet: React.FC<DistanceFromCenterlineGraphSetProps> = ({ data }) => {
  // Extract lane IDs using the helper function
  const laneIds = extractLaneIds(data);

  // Group data by LaneID
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.laneID]) {
      acc[item.laneID] = [];
    }
    acc[item.laneID].push(item);
    return acc;
  }, {} as { [laneID: number]: LaneDirectionOfTravelReportData[] });

  return (
    <Box>
      {laneIds.length === 0 ? (
        <Typography variant="body1" align="center">No Data</Typography>
      ) : (
        laneIds.map(laneID => (
          <Box key={laneID} id={`distance-from-centerline-graph-${laneID}`} sx={{ mb: 6 }}>
            <DistanceFromCenterlineOverTimeGraph data={groupedData[laneID]} laneNumber={laneID.toString()} />
          </Box>
        ))
      )}
    </Box>
  );
};

export default DistanceFromCenterlineGraphSet;