import toast from "react-hot-toast";
import { authApiHelper } from "./api-helper";

const NOTIFICATION_TYPES: string[] = [
  "connection_of_travel",
  "intersection_reference_alignment",
  "lane_direction_of_travel",
  "signal_state_conflict_notification",
  "signal_group_alignment_notification",
  "map_broadcast_rate_notification",
  "spat_broadcast_rate_notification",
];

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
    const queryParams: Record<string, string> = {};
    queryParams["intersection_id"] = intersection_id;
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();
    if (key) queryParams["key"] = key;

    const notifications = await authApiHelper.invokeApi({
      path: `/notifications/active`,
      token: token,
      queryParams,
      failureMessage: "Failed to retrieve active notifications",
    });

    return notifications ?? [];
  }

  async dismissNotifications({ token, ids }: { token: string; ids: string[] }): Promise<boolean> {
    let success = true;
    for (const id of ids) {
      success =
        success &&
        (await authApiHelper.invokeApi({
          path: `/notifications/active`,
          method: "DELETE",
          token: token,
          body: id.toString(),
          booleanResponse: true,
        }));
    }
    if (success) {
      toast.success(`Successfully Dismissed ${ids.length} Notifications`);
    } else {
      toast.error(`Failed to Dismiss some Notifications`);
    }
    return true;
  }

  async getAllNotifications({
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
    const queryParams: Record<string, string> = {};
    queryParams["intersection_id"] = intersection_id;
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();

    const notifications: MessageMonitor.Notification[] = [];
    for (const notificationType of NOTIFICATION_TYPES) {
      const resp: MessageMonitor.Notification[] =
        (await authApiHelper.invokeApi({
          path: `/notifications/${notificationType}`,
          token: token,
          queryParams,
          failureMessage: `Failed to retrieve notifications of type ${notificationType}`,
        })) ?? [];
      notifications.push(...resp);
    }

    return notifications;
  }
}

export default new NotificationApi();
