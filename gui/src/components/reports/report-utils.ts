export const extractLaneIds = (data: LaneDirectionOfTravelAssessment[]): number[] => {
  const laneIds = new Set<number>();
  data.forEach(assessment => {
    assessment.laneDirectionOfTravelAssessmentGroup.forEach(group => {
      laneIds.add(group.laneID);
    });
  });
  return Array.from(laneIds).sort((a, b) => a - b);
};