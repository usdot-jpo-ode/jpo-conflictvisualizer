/// <reference path="Event.d.ts" />
type SpatMessageCountProgressionEvent = MessageMonitor.Event & {
    timestampA: str
    timestampB: str
    messageType: str
    messageCountA: number
    messageCountB: number
}