
type BroadcastRateEvent = {
  topicName: str
  sourceDeviceId: str
  intersectionId: number
  timePeriod: ProcessingTimePeriod
  numberOfMessages: number
}