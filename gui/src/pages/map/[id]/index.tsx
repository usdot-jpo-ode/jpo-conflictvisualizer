import Head from "next/head";
import { Box, Container } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import React, { useEffect, useState, useRef } from "react";
import MapTab from "../../../components/map/map-component";
import { useRouter } from "next/router";
import NotificationApi from "../../../apis/notification-api";
import { useDashboardContext } from "../../../contexts/dashboard-context";

const Map = () => {
  const router = useRouter();
  const { id } = router.query;
  const [notification, setNotification] = useState<MessageMonitor.Notification | undefined>();
  const { intersectionId: dbIntersectionId } = useDashboardContext();

  const updateNotifications = () => {
    NotificationApi.getActiveNotifications({
      token: "token",
      intersection_id: dbIntersectionId.toString(),
      key: id as string,
    }).then((notifications) => {
      const notif = notifications.pop();
      console.log(notif);
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
