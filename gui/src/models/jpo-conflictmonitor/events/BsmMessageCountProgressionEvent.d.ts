/// <reference path="Event.d.ts" />
type BsmMessageCountProgressionEvent = MessageMonitor.Event & {
    timestampA: str
    timestampB: str
    messageType: str
    messageCountA: number
    messageCountB: number
}