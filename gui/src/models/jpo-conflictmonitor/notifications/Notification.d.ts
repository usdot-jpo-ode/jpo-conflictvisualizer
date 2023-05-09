declare namespace MessageMonitor {
type Notification = {
  Logger: any
  id: str
  key: str
  notificationGeneratedAt: number
  notificationType: str
  notificationText: str
  notificationHeading: str
  intersectionID: number
  roadRegulatorID: number
  notificationExpiresAt: Date
  String: abstract
}
}