import React from 'react';
import { Box } from '@mui/material';
import HeadingErrorOverTimeGraph from './heading-error-over-time-graph';
import { extractLaneIds } from '../report-utils';

interface HeadingErrorGraphSetProps {
  data: LaneDirectionOfTravelAssessment[];
}

const HeadingErrorGraphSet: React.FC<HeadingErrorGraphSetProps> = ({ data }) => {
  // Extract lane IDs using the helper function
  const laneIds = extractLaneIds(data);

  // Group data by LaneID
  const groupedData = data.reduce((acc, assessment) => {
    assessment.laneDirectionOfTravelAssessmentGroup.forEach(group => {
      if (!acc[group.laneID]) {
        acc[group.laneID] = [];
      }
      acc[group.laneID].push({
        ...assessment,
        laneDirectionOfTravelAssessmentGroup: [group]
      });
    });
    return acc;
  }, {} as { [laneID: number]: LaneDirectionOfTravelAssessment[] });

  return (
    <Box>
      {laneIds.map(laneID => (
        <Box key={laneID} id={`heading-error-graph-${laneID}`} sx={{ mb: 6 }}>
          <HeadingErrorOverTimeGraph data={groupedData[laneID]} laneNumber={laneID.toString()} />
        </Box>
      ))}
    </Box>
  );
};

export default HeadingErrorGraphSet;