const KEYCLOAK_ADMIN_ENDPOINT = "http://localhost:8084/admin/realms/conflictvisualizer";
const KEYCLOAK_AUTH_ENDPOINT = "http://localhost:8084/auth/realms/conflictvisualizer";
import toast from "react-hot-toast";

class KeycloakApi {
  isUserAdmin(roles: string[]): boolean {
    return roles.includes("ADMIN" as UserRole);
  }

  async getGroups({ token }: { token: string }): Promise<KeycloakRole[]> {
    return (
      await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/groups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Request failed with status code " + response.status + ": " + response.statusText);
          return [];
        }
      })
    ).map(async (kRole: any) => {
      return {
        id: kRole.id,
        name: kRole.name,
      };
    });
  }

  async getUserRoles({ token, id }: { token: string; id: string }): Promise<UserRole | undefined> {
    return (
      await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}/groups`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Request failed with status code " + response.status + ": " + response.statusText);
          return [];
        }
      })
    )
      .map((role: any) => role.name)
      .filter((role: string) => ["admin", "user"].includes(role))
      .pop();
  }

  async getUsersList({ token }: { token: string }): Promise<User[]> {
    return await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response: Response) => {
        console.log("RESPONSE", response);
        if (response.ok) {
          const body = await response.json();
          return await Promise.all(
            body.map(async (kUser: any) => {
              const user: User = {
                id: kUser.id,
                email: kUser.username,
                first_name: kUser.firstName,
                last_name: kUser.lastName,
                role: (await this.getUserRoles({ token, id: kUser.id })) ?? "user",
              };
              return user;
            })
          );
        } else {
          toast.error("Request failed with status code " + response.status + ": " + response.statusText);
          console.error("Request failed with status code " + response.status + ": " + response.statusText);
          return [];
        }
      })
      .catch((e) => {
        toast.error("Request failed: " + e.message);
        console.error(e);
        return [];
      });
  }

  async getUserInfo({ token, id }: { token: string; id: string }): Promise<User | null> {
    return await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response: Response) => {
        console.log("RESPONSE", response);
        if (response.ok) {
          const kUser = await response.json();
          return {
            id: kUser.id,
            email: kUser.username,
            first_name: kUser.firstName,
            last_name: kUser.lastName,
            role: (await this.getUserRoles({ token, id: kUser.id })) ?? "user",
            email_preference: kUser.attributes?.EMAIL_FREQUENCY?.[0] ?? "NEVER",
          };
        } else {
          toast.error("Request failed with status code " + response.status + ": " + response.statusText);
          console.error("Request failed with status code " + response.status + ": " + response.statusText);
          return null;
        }
      })
      .catch((e) => {
        toast.error("Request failed: " + e.message);
        console.error(e);
        return null;
      });
  }

  async removeUser({ token, id }: { token: string; id: string }): Promise<boolean> {
    return (
      await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).ok;
  }

  async addUserToGroup({ token, id, role }: { token: string; id: string; role: UserRole }): Promise<boolean> {
    const groupId: string | undefined = (await this.getGroups({ token })).find((r) => r.name === role)?.id;
    return (
      await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}/groups/${groupId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    ).ok;
  }

  async removeUserFromGroup({ token, id, role }: { token: string; id: string; role: UserRole }): Promise<boolean> {
    const groupId: string | undefined = (await this.getGroups({ token })).find((r) => r.name === role)?.id;
    return (
      await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    ).ok;
  }

  async updateUserInfo({
    token,
    id,
    email,
    first_name,
    last_name,
  }: {
    token: string;
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  }): Promise<boolean> {
    const updatedParams = {};
    if (email) {
      updatedParams["username"] = email;
      updatedParams["email"] = email;
      updatedParams["emailVerified"] = false;
    }
    if (first_name) {
      updatedParams["firstName"] = first_name;
    }
    if (last_name) {
      updatedParams["lastName"] = last_name;
    }

    return (
      await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedParams),
      })
    ).ok;
  }

  async createUser({
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
  }): Promise<boolean> {
    const resp = await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        email: email,
        emailVerified: false,
        firstName: first_name,
        lastName: last_name,
        groups: [role],
        enabled: true,
        requiredActions: ["UPDATE_PASSWORD", "VERIFY_EMAIL"],
      }),
    });
    if (resp.ok) {
      const id = await this.getUsersList({ token }).then((users) => users.find((u) => u.email === email)?.id);
      await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}/execute-actions-email`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["UPDATE_PASSWORD", "VERIFY_EMAIL"]),
      });
    }
    return resp.ok;
  }

  async logout({ token, refresh_token }: { token: string; refresh_token: string }): Promise<void> {
    await fetch(`${KEYCLOAK_AUTH_ENDPOINT}/protocol/openid-connect/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=conflictvisualizer-gui&refresh_token=${refresh_token}`,
    });
  }

  async updateAttributes({
    token,
    id,
    attribute,
  }: {
    id: string;
    token: string;
    attribute: Record<string, string[]>;
  }): Promise<boolean> {
    const attributes = (
      await (
        await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).json()
    ).attributes;

    const resp = await fetch(`${KEYCLOAK_ADMIN_ENDPOINT}/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attributes: { ...attributes, ...attribute },
      }),
    });
    return resp.ok;
  }
}

export default new KeycloakApi();
