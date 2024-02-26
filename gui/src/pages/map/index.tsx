import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import React from "react";
import MapTab from "../../components/map/map-component";
import { useDashboardContext } from "../../contexts/dashboard-context";

const Map = () => {
  const currentDate = new Date();
  const { intersectionId: dbIntersectionId, roadRegulatorId } = useDashboardContext();
  return (
    <>
      <Head>
        <title>Dashboard | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={false} style={{ padding: 0, width: "100%", height: "100%", display: "flex" }}>
          <MapTab
            sourceData={undefined}
            sourceDataType={undefined}
            intersectionId={dbIntersectionId}
            roadRegulatorId={roadRegulatorId}
          />
        </Container>
      </Box>
    </>
  );
};

Map.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Map;
