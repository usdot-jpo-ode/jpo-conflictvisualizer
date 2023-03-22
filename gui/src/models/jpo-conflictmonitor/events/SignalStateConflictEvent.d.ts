/// <reference path="Event.d.ts" />
type SignalStateConflictEvent = MessageMonitor.Event & {
  timestamp: number
  roadRegulatorID: number
  intersectionID: number
  conflictType: J2735MovementPhaseState
  firstConflictingSignalGroup: number
  firstConflictingSignalState: J2735MovementPhaseState
  secondConflictingSignalGroup: number
  secondConflictingSignalState: J2735MovementPhaseState
}