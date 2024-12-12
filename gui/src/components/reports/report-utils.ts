import { format, eachDayOfInterval } from 'date-fns';

export const extractLaneIds = (data: LaneDirectionOfTravelAssessment[]): number[] => {
  const laneIds = new Set<number>();
  data.forEach(assessment => {
    assessment.laneDirectionOfTravelAssessmentGroup.forEach(group => {
      laneIds.add(group.laneID);
    });
  });
  return Array.from(laneIds).sort((a, b) => a - b);
};

export const generateDateRange = (startDate: Date, endDate: Date): string[] => {
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  return dates.map(date => format(date, 'yyyy-MM-dd'));
};