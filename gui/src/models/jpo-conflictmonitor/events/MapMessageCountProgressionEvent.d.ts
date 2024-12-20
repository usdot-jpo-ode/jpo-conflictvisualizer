/// <reference path="Event.d.ts" />
type MapMessageCountProgressionEvent = MessageMonitor.Event & {
    timestampA: str
    timestampB: str
    messageType: str
    messageCountA: number
    messageCountB: number
}