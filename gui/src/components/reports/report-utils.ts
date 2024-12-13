import { format, eachDayOfInterval } from 'date-fns';

export type LaneDirectionOfTravelReportData = {
    timestamp: number;
    laneID: number;
    segmentID: number;
    headingDelta: number;
    medianCenterlineDistance: number;
  };

export const extractLaneIds = (data: LaneDirectionOfTravelReportData[]): number[] => {
  const laneIds = new Set<number>();
  data.forEach(assessment => {
    laneIds.add(assessment.laneID);
  });
  return Array.from(laneIds).sort((a, b) => a - b);
};

export const generateDateRange = (startDate: Date, endDate: Date): string[] => {
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  return dates.map(date => format(date, 'yyyy-MM-dd'));
};