/// <reference path="Event.d.ts" />
type SignalStateConflictEvent = MessageMonitor.Event & {
  timestamp: number;
  conflictType: J2735MovementPhaseState;
  firstConflictingSignalGroup: number;
  firstConflictingSignalState: J2735MovementPhaseState;
  secondConflictingSignalGroup: number;
  secondConflictingSignalState: J2735MovementPhaseState;
  source: str;
  firstIngressLane: number;
  firstIngressLaneType: str;
  firstEgressLane: number;
  firstEgressLaneType: str;
  secondIngressLane: number;
  secondIngressLaneType: str;
  secondEgressLane: number;
  secondEgressLaneType: str;
}