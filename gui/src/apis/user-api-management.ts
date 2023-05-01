import { authApiHelper } from "./api-helper";

class CreationRequestApi {
  async createUserCreationRequest({
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
  }) {
    const notifications = await authApiHelper.invokeApi({
      path: `/users/create_user_creation_request`,
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

  async getUserCreationRequests({ token }: { token: string }): Promise<User[]> {
    const creationRequests = await authApiHelper.invokeApi({
      path: `/users/find_user_creation_request`,
      token: token,
      method: "GET",
    });

    return creationRequests;
  }

  async removeUserCreationRequest({ token, email }: { token: string; email: string }) {
    await authApiHelper.invokeApi({
      path: `/users/delete_user_creation_request`,
      token: token,
      method: "DELETE",
      queryParams: { email },
    });
  }
}

export default new CreationRequestApi();
