/// <reference path="Event.d.ts" />
type TimeChangeDetailsEvent = MessageMonitor.Event & {
  signalGroup: number
  firstSpatTimestamp: number
  secondSpatTimestamp: number
  firstTimeMarkType: number
  secondTimeMarkType: number
  firstConflictingTimemark: number
  secondConflictingTimemark: number
}