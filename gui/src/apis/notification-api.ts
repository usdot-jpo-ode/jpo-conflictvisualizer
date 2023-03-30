import { authApiHelper } from "./api-helper";

class NotificationApi {
  async getActiveNotifications({
    token,
    intersection_id,
    startTime,
    endTime,
  }: {
    token: string;
    intersection_id: string;
    startTime?: Date;
    endTime?: Date;
  }): Promise<MessageMonitor.Notification[]> {
    // return this.getNotifications({ token, intersection_id, startTime, endTime });
    const queryParams: Record<string, string> = {};
    if (intersection_id) queryParams["intersection_id"] = intersection_id;
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();

    const notifications = await authApiHelper.invokeApi({
      path: `/notifications/active`,
      token: token,
      queryParams,
    });

    return notifications;
  }

  async getNotifications({
    token,
    intersection_id,
    startTime,
    endTime,
  }: {
    token: string;
    intersection_id: string;
    startTime?: Date;
    endTime?: Date;
  }): Promise<MessageMonitor.Notification[]> {
    const NOTIFICATIONS = [
      "spat_broadcast_rate_notification",
      "signal_state_conflict_notification",
      "signal_group_alignment_notification",
      "map_broadcast_rate_notification",
      "lane_direction_of_travel",
      "intersection_reference_alignment",
      "connection_of_travel",
    ];

    const notifications: MessageMonitor.Notification[] = [];
    for (let i = 0; i < NOTIFICATIONS.length; i++) {
      const queryParams: Record<string, string> = {};
      queryParams["latest"] = "true";
      //   if (intersection_id) queryParams["intersection_id"] = intersection_id;
      //   if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
      //   if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();

      var response = await authApiHelper.invokeApi({
        path: `/notifications/${NOTIFICATIONS[i]}`,
        token: token,
        queryParams,
      });
      notifications.push(...response);
    }

    return notifications;
  }

  async getNotification({
    token,
    id,
  }: {
    token: string;
    id: string;
  }): Promise<MessageMonitor.Notification | undefined> {
    const NOTIFICATIONS = [
      "spat_broadcast_rate_notification",
      "signal_state_conflict_notification",
      "signal_group_alignment_notification",
      "map_broadcast_rate_notification",
      "lane_direction_of_travel",
      "intersection_reference_alignment",
      "connection_of_travel",
    ];

    const notifications: MessageMonitor.Notification[] = [];
    for (let i = 0; i < NOTIFICATIONS.length; i++) {
      const queryParams: Record<string, string> = {};

      var response = await authApiHelper.invokeApi({
        path: `/notifications/${NOTIFICATIONS[i]}`,
        token: token,
        queryParams,
      });
      notifications.push(...response);
    }

    return notifications.filter((notification) => notification.id === id).pop();
  }
}

export default new NotificationApi();
