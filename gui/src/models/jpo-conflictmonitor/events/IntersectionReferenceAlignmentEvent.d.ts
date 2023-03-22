/// <reference path="Event.d.ts" />
type IntersectionReferenceAlignmentEvent = MessageMonitor.Event & {
  sourceID: str
  timestamp: number
  spatRoadRegulatorIds: Set<Integer>
  mapRoadRegulatorIds: Set<Integer>
  spatIntersectionIds: Set<Integer>
  mapIntersectionIds: Set<Integer>
}