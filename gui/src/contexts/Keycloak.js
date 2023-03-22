import KeycloakProvider from "next-auth/providers/keycloak";

const kaycloakProvider = KeycloakProvider({
  clientId: "ui",
  realm: "cimms",
  issuer: "http://localhost:8080/",
});

export default kaycloakProvider;
