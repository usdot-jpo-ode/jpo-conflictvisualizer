import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { OAuthConfig } from "next-auth/providers";
import KeycloakProvider, { KeycloakProfile } from "next-auth/providers/keycloak";
import keycloakApi from "../../../apis/keycloak-api";

const parseJwt = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (err) {
    return { ERROR: err };
  }
};

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      issuer: `http://${process.env.DOCKER_HOST_IP}:8084/realms/${process.env.KEYCLOAK_REALM}`,
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account }: { token: any; account?: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.role = "USER";
        const parsedJwt = parseJwt(account.access_token);
        token.userId = parsedJwt?.sub;
        try {
          token.role = (parsedJwt?.resource_access?.["realm-management"]?.roles ?? []).includes("manage-users")
            ? "ADMIN"
            : "USER";
        } catch (err) {
          token.role = err;
        }
        token.expirationDate = parsedJwt?.exp;
        console.log("TOKEN", token);
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expirationDate = token.expirationDate;
      session.role = token.role;
      session.userId = token.userId;
      return session;
    },
  },
  events: {
    async signOut({ session, token }: { token: JWT; session: any }) {
      if (token.provider === "keycloak") {
        keycloakApi.logout({
          token: session.accessToken as string,
          refresh_token: session.refreshToken as string,
        });
      }
    },
  },
};
export default NextAuth(authOptions);
