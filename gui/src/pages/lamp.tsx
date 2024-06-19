import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { QRCode } from 'react-qrcode-logo';
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const KEYCLOAK_AUTH_ENDPOINT = `${publicRuntimeConfig.AUTH_SERVER_URL}/realms/${publicRuntimeConfig.KEYCLOAK_REALM}`;

const lampProfile: LAMPProfile = {
  name: `${publicRuntimeConfig.PROFILE_NAME}`,
  keycloak_endpoint: KEYCLOAK_AUTH_ENDPOINT,
  cimms_broker: `${publicRuntimeConfig.CM_SERVER_URL}`,
  realm: `${publicRuntimeConfig.KEYCLOAK_REALM}`,
  client: `${publicRuntimeConfig.KEYCLOAK_CLIENT_ID}`,
  client_secret: `${publicRuntimeConfig.KEYCLOAK_CLIENT_SECRET}`      
};

let jsonString = JSON.stringify({
  name: lampProfile.name,
  keyCloakEndpoint: lampProfile.keycloak_endpoint,
  cimmsBroker: lampProfile.cimms_broker,
  realm: lampProfile.realm,
  client: lampProfile.client,
  clientSecret: lampProfile.client_secret
});

const Page = () => {
  return (
    <>
      <Head>
        <title>LAMP | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Light Activity Monitoring Platform
          </Typography>
          <Typography sx={{ mb: 3, textAlign: 'center' }} variant="body1">
            Use the LAMP app to reasearch further into the alignement of signal lights with their messages. Use this QR code to create a profile in the LAMP app:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4
            }}
          >
            <QRCode value={jsonString}
            size={425} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
