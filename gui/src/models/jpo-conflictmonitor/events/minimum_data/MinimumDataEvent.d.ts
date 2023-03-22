
type MinimumDataEvent = {
  sourceDeviceId: str
  intersectionId: number
  timePeriod: ProcessingTimePeriod
  missingDataElements: String[]
}