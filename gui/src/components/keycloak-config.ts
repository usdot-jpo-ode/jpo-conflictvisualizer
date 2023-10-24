import Keycloak from "keycloak-js";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const keycloak = new Keycloak({
  url: `${publicRuntimeConfig.AUTH_SERVER_URL}`,
  realm: `${publicRuntimeConfig.KEYCLOAK_REALM}`,
  clientId: `${publicRuntimeConfig.KEYCLOAK_CLIENT_ID}`,
  //   clientSecret: `${publicRuntimeConfig.KEYCLOAK_CLIENT_SECRET}`,
});

export default keycloak;
