import { authApiHelper } from "./api-helper";

class NotificationApi {
  async getActiveNotifications({
    token,
    intersection_id,
    startTime,
    endTime,
    key,
  }: {
    token: string;
    intersection_id: string;
    startTime?: Date;
    endTime?: Date;
    key?: string;
  }): Promise<MessageMonitor.Notification[]> {
    // return this.getNotifications({ token, intersection_id, startTime, endTime });
    const queryParams: Record<string, string> = {};
    if (intersection_id) queryParams["intersection_id"] = intersection_id;
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();
    if (key) queryParams["key"] = key;

    const notifications = await authApiHelper.invokeApi({
      path: `/notifications/active`,
      token: token,
      queryParams,
    });

    return notifications;
  }
}

export default new NotificationApi();
