import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { NotificationsTable } from "../components/notifications/notifications-table";
import { ConnectionOfTravelAssessmentCard } from "../components/assessments/connection-of-travel-assessment";
import { LaneDirectionOfTravelAssessmentCard } from "../components/assessments/lane-direction-of-travel-assessment";
import { SignalStateAssessmentCard } from "../components/assessments/signal-state-assessment";
import { SignalStateEventAssessmentCard } from "../components/assessments/signal-state-event-assessment";
import React, { useEffect, useState, useRef } from "react";
import AssessmentsApi from "../apis/assessments-api";
import { useDashboardContext } from "../contexts/dashboard-context";
import { useSession } from "next-auth/react";

const Page = () => {
  const [assessment, setAssessments] = useState<Assessment[]>([]);
  const { intersectionId, roadRegulatorId } = useDashboardContext();

  // create hooks, and methods for each assessment type:
  const [signalStateAssessment, setSignalStateAssessment] = useState<SignalStateAssessment | undefined>(undefined);
  // create hooks, and methods for each assessment type:
  const [signalStateEventAssessment, setSignalStateEventAssessment] = useState<SignalStateEventAssessment | undefined>(
    undefined
  );
  const [connectionOfTravelAssessment, setConnectionOfTravelAssessment] = useState<
    ConnectionOfTravelAssessment | undefined
  >(undefined);
  const [laneDirectionOfTravelAssessment, setLaneDirectionOfTravelAssessment] = useState<
    LaneDirectionOfTravelAssessment | undefined
  >(undefined);
  const { data: session } = useSession();

  const getAssessments = async () => {
    if (intersectionId && session?.accessToken) {
      setSignalStateAssessment(
        (await AssessmentsApi.getAssessment(
          session?.accessToken,
          "signal_state_assessment",
          intersectionId.toString(),
          roadRegulatorId?.toString()
        )) as SignalStateAssessment
      );
      setSignalStateEventAssessment(
        (await AssessmentsApi.getAssessment(
          session?.accessToken,
          "signal_state_event_assessment",
          intersectionId.toString(),
          roadRegulatorId?.toString()
        )) as SignalStateEventAssessment
      );
      setConnectionOfTravelAssessment(
        (await AssessmentsApi.getAssessment(
          session?.accessToken,
          "connection_of_travel",
          intersectionId.toString(),
          roadRegulatorId?.toString()
        )) as ConnectionOfTravelAssessment
      );
      setLaneDirectionOfTravelAssessment(
        (await AssessmentsApi.getAssessment(
          session?.accessToken,
          "lane_direction_of_travel",
          intersectionId.toString(),
          roadRegulatorId?.toString()
        )) as LaneDirectionOfTravelAssessment
      );
    } else {
      console.error(
        "Did not attempt to get assessment data. Access token:",
        session?.accessToken,
        "Intersection ID:",
        intersectionId
      );
    }
  };

  useEffect(() => {
    getAssessments();
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
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <ConnectionOfTravelAssessmentCard assessment={connectionOfTravelAssessment} small={true} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <LaneDirectionOfTravelAssessmentCard assessment={laneDirectionOfTravelAssessment} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <SignalStateAssessmentCard assessment={signalStateAssessment} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <SignalStateEventAssessmentCard assessment={signalStateEventAssessment} />
            </Grid>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <NotificationsTable simple={true} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
