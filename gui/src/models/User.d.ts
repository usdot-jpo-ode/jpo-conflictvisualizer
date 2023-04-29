type User = {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  id: string;
  email_preference?: EmailPreference;
};

const userRoles = ["admin", "user"] as const;
type UserRole = (typeof userRoles)[number];

const emailPreference = ["ALWAYS", "ONCE_PER_HOUR", "ONCE_PER_DAY", "NEVER"] as const;
type EmailPreference = (typeof emailPreference)[number];

type KeycloakRole = {
  id: string;
  name: string;
};
