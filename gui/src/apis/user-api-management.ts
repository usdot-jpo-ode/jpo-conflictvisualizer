import { authApiHelper } from "./api-helper";

class NotificationApi {
  async getActiveNotifications({
    token,
    email,
    first_name,
    last_name,
    role,
  }: {
    token: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
  }): Promise<MessageMonitor.Notification[]> {
    const notifications = await authApiHelper.invokeApi({
      path: `/users/create`,
      token: token,
      method: "POST",
      body: {
        email: email,
        firstName: first_name,
        lastName: last_name,
        role: role,
      },
    });

    return notifications;
  }
}

export default new NotificationApi();
