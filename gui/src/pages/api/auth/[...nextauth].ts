import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

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
      issuer: process.env.KEYCLOAK_BASE_URL!,
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account }: { token: any; account?: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.role = (parseJwt(account.access_token)?.realm_access?.roles ?? []).includes("ADMIN")
          ? "admin"
          : "user";
        // try {
        //   const payload =
        //   token.role = payload.resource_access.account.roles.contains("admin") ? "admin" : "user";
        // } catch (err) {
        //   console.error(err);
        // }
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.role = token.role;
      return session;
    },
  },
};
export default NextAuth(authOptions);
