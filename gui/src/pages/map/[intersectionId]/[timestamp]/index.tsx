import Head from "next/head";
import { Box, Container, Typography } from "@mui/material";
import { DashboardLayout } from "../../../../components/dashboard-layout";
import React, { useEffect, useState } from "react";
import MapTab from "../../../../components/map/map-component";
import { useRouter } from "next/router";
import NotificationApi from "../../../../apis/notification-api";
import { useDashboardContext } from "../../../../contexts/dashboard-context";
import { useSession } from "next-auth/react";

const Map = () => {
  const router = useRouter();
  const { intersectionId, timestamp } = router.query;

  let timestampInt: number | undefined = undefined;
  try {
    timestampInt = parseInt(timestamp as string);
  } catch (e) {
    timestampInt = undefined;
  }

  let intersectionIdInt: number | undefined = undefined;
  try {
    intersectionIdInt = parseInt(intersectionId as string);
  } catch (e) {
    intersectionIdInt = undefined;
  }

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
            sourceData={timestampInt !== undefined ? { timestamp: timestampInt } : undefined}
            sourceDataType={timestampInt !== undefined ? "timestamp" : undefined}
            intersectionId={intersectionIdInt}
          />
        </Container>
      </Box>
    </>
  );
};

Map.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Map;
