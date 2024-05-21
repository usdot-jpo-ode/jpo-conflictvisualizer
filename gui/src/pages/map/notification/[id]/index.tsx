import Head from "next/head";
import { Box, Container } from "@mui/material";
import { DashboardLayout } from "../../../../components/dashboard-layout";
import React, { useEffect, useState } from "react";
import MapTab from "../../../../components/map/map-component";
import { useRouter } from "next/router";
import NotificationApi from "../../../../apis/notification-api";
import { useDashboardContext } from "../../../../contexts/dashboard-context";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken } from "../../../../slices/userSlice";

const Map = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const authToken = useSelector(selectAuthToken);
  const [notification, setNotification] = useState<MessageMonitor.Notification | undefined>();
  const { intersectionId, roadRegulatorId } = useDashboardContext();

  const updateNotifications = () => {
    if (authToken && intersectionId) {
      NotificationApi.getActiveNotifications({
        token: authToken,
        intersectionId,
        roadRegulatorId,
        key: id as string,
      }).then((notifications) => {
        const notif = notifications?.pop();
        setNotification(notif);
      });
    } else {
      console.error(
        "Did not attempt to get notification data in map. Access token:",
        authToken,
        "Intersection ID:",
        intersectionId
      );
    }
  };

  useEffect(() => {
    updateNotifications();
  }, [intersectionId]);

  return (
    <>
      <Head>
        <title>Dashboard | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0,
        }}
      >
        <Container maxWidth={false} style={{ padding: 0, width: "100%", height: "100%", display: "flex" }}>
          <MapTab
            sourceData={notification}
            sourceDataType={notification !== undefined ? "notification" : undefined}
            intersectionId={intersectionId}
            roadRegulatorId={roadRegulatorId}
            loadOnNull={false}
          />
        </Container>
      </Box>
    </>
  );
};

Map.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Map;
