import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { SettingsNotifications } from "../components/settings/settings-notifications";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  updateUserEmailPreference,
} from "../slices/userSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../store";

const Page = () => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();

  const user = useSelector(selectUser);

  const updateSettings = async (emailPreference: EmailPreferences) => {
    dispatch(updateUserEmailPreference(emailPreference));
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
