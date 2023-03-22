import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      issuer: process.env.KEYCLOAK_BASE_URL!,
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
};
export default NextAuth(authOptions);
