import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { SettingsNotifications } from "../components/settings/settings-notifications";
import React from "react";
import keycloakApi from "../apis/keycloak-api";
import { useSession } from "next-auth/react";
import { useDashboardContext } from "../contexts/dashboard-context";
import userManagementApi from "../apis/user-management-api";

const Page = () => {
  const { data: session } = useSession();
  const { user, setUser } = useDashboardContext();

  const updateSettings = async (emailPreference: EmailPreferences) => {
    if (session?.accessToken && !session?.user?.email) {
      const success = await userManagementApi.updateUserEmailPreference({
        token: session?.accessToken,
        email: session?.user?.email!,
        preferences: emailPreference,
      });
      if (success && user !== undefined) {
        setUser({ ...user, email_preference: emailPreference });
      }
    }
  };

  return (
    <>
      <Head>
        <title>Settings | Material Kit</title>
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
            Settings
          </Typography>
          <SettingsNotifications
            value={user?.email_preference}
            onSave={updateSettings}
            userRole={user?.role ?? "USER"}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
