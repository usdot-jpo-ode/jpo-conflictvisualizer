type User = {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  id: string;
};

const userRoles = ["admin", "user"] as const;
type UserRole = typeof userRoles[number];

type KeycloakRole = {
  id: string;
  name: string;
};
