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



export const processMissingElements = (elements: string[]): string[] => {
  // Step 1: Process each element to remove prefixes and format the string
  const processedElements = elements.map(element => {
    // Remove "$." prefix if it exists
    if (element.startsWith("$.")) {
      element = element.substring(2);
    }

    // Remove "payload.data." prefix if it exists
    if (element.startsWith("payload.data.")) {
      element = element.substring("payload.data.".length);
    }

    // Remove the first colon and anything that comes after it
    const colonIndex = element.indexOf(':');
    if (colonIndex !== -1) {
      element = element.substring(0, colonIndex);
    }

    // Replace '[' with ' ' and ']' with ''
    element = element.replace(/\[/g, ' ').replace(/\]/g, '');

    return element;
  });

  // Step 2: Group elements by the last part of the string
  const groupedElements: { [key: string]: string[] } = {};
  processedElements.forEach(element => {
    const parts = element.split('.');
    const lastPart = parts.pop();
    const key = parts.join('.');
    if (!groupedElements[key]) {
      groupedElements[key] = [];
    }
    if (lastPart) {
      groupedElements[key].push(lastPart);
    }
  });

  // Step 3: Create readable strings from the grouped elements
  const readableStrings = Object.entries(groupedElements).map(([key, values]) => {
    const uniqueValues = Array.from(new Set(values));
    let readableString;
    if (uniqueValues.length > 2) {
      const lastValue = uniqueValues.pop();
      readableString = `${uniqueValues.join(', ')}, and ${lastValue} missing from ${key.split('.').reverse().join(', in ')}`;
    } else {
      readableString = `${uniqueValues.join(' and ')} missing from ${key.split('.').reverse().join(', in ')}`;
    }
    return readableString;
  });

  return readableStrings;
};