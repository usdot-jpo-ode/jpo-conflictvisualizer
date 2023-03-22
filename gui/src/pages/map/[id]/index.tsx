import Head from "next/head";
import { Box, Container } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import React, { useEffect, useState, useRef } from "react";
import MapTab from "../../../components/map/map-component";
import { useRouter } from "next/router";
import NotificationApi from "../../../apis/notification-api";

const Map = () => {
  const router = useRouter();
  const { id } = router.query;
  const [notification, setNotification] = useState<MessageMonitor.Notification | undefined>();

  const updateNotifications = () => {
    NotificationApi.getNotification({ token: "token", id: id as string }).then((notif) => {
      setNotification(notif);
    });
  };

  useEffect(() => {
    updateNotifications();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container
          maxWidth={false}
          style={{ padding: 0, width: "100%", height: "100%", display: "flex" }}
        >
          <MapTab notification={notification} />
        </Container>
      </Box>
    </>
  );
};

Map.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Map;
