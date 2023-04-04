class KeycloakApi {
  async getUsersList({ token }: { token: string }): Promise<User[]> {
    return (
      await fetch("http://localhost:8084/admin/realms/conflictvisualizer/clients", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error(
            "Request failed with status code " + response.status + ": " + response.statusText
          );
          return [];
        }
      })
    ).map((kUser: any) => {
      return {
        email: kUser.username,
        first_name: kUser.firstName,
        last_name: kUser.lastName,
        role: kUser.role,
      };
    });
  }
}

export default new KeycloakApi();
