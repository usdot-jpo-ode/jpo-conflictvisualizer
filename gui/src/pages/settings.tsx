import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { SettingsNotifications } from "../components/settings/settings-notifications";
import React, { useEffect, useState } from "react";
import keycloakApi from "../apis/keycloak-api";
import { useSession } from "next-auth/react";
import { useDashboardContext } from "../contexts/dashboard-context";
import userManagementApi from "../apis/user-management-api";

const parseJwt = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (err) {
    return { ERROR: err };
  }
};

const Page = () => {
  const { data: session } = useSession();
  const { user, setUser } = useDashboardContext();
  const [userProfile, setUserProfile] = useState<User | undefined>(user);

  useEffect(() => {
    getUser();
  }, [session, user]);

  const getUser = async () => {
    if (session?.accessToken && session?.role) {
      const parsedJwt = parseJwt(session?.accessToken);
      const localUser: User = {
        email: parsedJwt?.preferred_username,
        first_name: parsedJwt?.given_name,
        last_name: parsedJwt?.family_name,
        id: parsedJwt?.sub,
        role: session?.role,
        email_preference: await userManagementApi.getUserEmailPreference({
          token: session?.accessToken,
        }),
      };
      setUserProfile(localUser);
    } else {
      console.error(
        "Did not attempt to get user email preferences. Access token:",
        session?.accessToken,
        "Role:",
        session?.role
      );
      setUserProfile(user);
    }
  };

  const updateSettings = async (emailPreference: EmailPreferences) => {
    if (session?.accessToken && session?.user?.email) {
      const success = await userManagementApi.updateUserEmailPreference({
        token: session?.accessToken,
        email: session?.user?.email!,
        preferences: emailPreference,
      });
      if (success && user !== undefined) {
        setUser({ ...user, email_preference: emailPreference });
      }
    } else {
      console.error(
        "Did not attempt to update user email preferences. Access token:",
        session?.accessToken,
        "User Email:",
        session?.user?.email
      );
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
            value={userProfile?.email_preference}
            onSave={updateSettings}
            userRole={userProfile?.role ?? "USER"}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
