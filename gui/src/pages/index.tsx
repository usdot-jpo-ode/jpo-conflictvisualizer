import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { NotificationsTable } from "../components/notifications/notifications-table";
import { ConnectionOfTravelAssessmentCard } from "../components/assessments/connection-of-travel-assessment";
import { LaneDirectionOfTravelAssessmentCard } from "../components/assessments/lane-direction-of-travel-assessment";
import { StopLineStopAssessmentCard } from "../components/assessments/stop-line-stop-assessment";
import { SignalStateEventAssessmentCard } from "../components/assessments/signal-state-event-assessment";
import React, { useEffect, useState, useRef } from "react";
import AssessmentsApi from "../apis/assessments-api";
import { useDashboardContext } from "../contexts/dashboard-context";
import { useSession } from "next-auth/react";
import { EventCountWidget } from '../components/event-counts/event-count-widget';
import { EventCountWeekChart } from "../components/event-counts/event-count-week-chart";

const Page = () => {
  const [assessment, setAssessments] = useState<Assessment[]>([]);
  const { intersectionId, roadRegulatorId } = useDashboardContext();

  // create hooks, and methods for each assessment type:
  const [stopLineStopAssessment, setStopLineStopAssessment] = useState<StopLineStopAssessment | undefined>(undefined);
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
      setStopLineStopAssessment(
        (await AssessmentsApi.getLatestAssessment(
          session?.accessToken,
          "signal_state_assessment",
          intersectionId,
          roadRegulatorId
        )) as StopLineStopAssessment
      );
      setSignalStateEventAssessment(
        (await AssessmentsApi.getLatestAssessment(
          session?.accessToken,
          "signal_state_event_assessment",
          intersectionId,
          roadRegulatorId
        )) as SignalStateEventAssessment
      );
      setConnectionOfTravelAssessment(
        (await AssessmentsApi.getLatestAssessment(
          session?.accessToken,
          "connection_of_travel",
          intersectionId,
          roadRegulatorId
        )) as ConnectionOfTravelAssessment
      );
      setLaneDirectionOfTravelAssessment(
        (await AssessmentsApi.getLatestAssessment(
          session?.accessToken,
          "lane_direction_of_travel",
          intersectionId,
          roadRegulatorId
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
          <Grid container spacing={3} alignItems="flex-start">
            <Box mt={3} mr={-3}>
              <EventCountWidget accessToken={session?.accessToken} intersectionId={intersectionId} />
            </Box>
            <Grid item xs={12} md={3} style={{ minWidth: 324 }}>
              <EventCountWeekChart accessToken={session?.accessToken} intersectionId={intersectionId} eventType="bsm" eventLabel="BSM"/>
            </Grid>
            <Grid item xs={12} md={3} style={{ minWidth: 324 }}>
              <EventCountWeekChart accessToken={session?.accessToken} intersectionId={intersectionId} eventType="spat" eventLabel="SPAT"/>
            </Grid>
            <ConnectionOfTravelAssessmentCard assessment={connectionOfTravelAssessment} />
            <StopLineStopAssessmentCard assessment={stopLineStopAssessment} />
            <SignalStateEventAssessmentCard assessment={signalStateEventAssessment} />
            <LaneDirectionOfTravelAssessmentCard assessment={laneDirectionOfTravelAssessment} />
            <Grid item xs={12}>
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
