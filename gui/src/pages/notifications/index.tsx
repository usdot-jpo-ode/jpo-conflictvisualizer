import Head from "next/head";
import { Box } from "@mui/material";
import { NotificationsTable } from "../../components/notifications/notifications-table";
import { DashboardLayout } from "../../components/dashboard-layout";
import React from "react";

const Page = () => {
  return (
    <>
      <Head>
        <title>Notifications | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <NotificationsTable simple={false} />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
