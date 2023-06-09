import Head from "next/head";
import { Box, Container, Grid, TextFieldProps } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import NotificationApi from "../apis/notification-api";
import { ConnectionOfTravelAssessmentCard } from "../components/assessments/connection-of-travel-assessment";
import { LaneDirectionOfTravelAssessmentCard } from "../components/assessments/lane-direction-of-travel-assessment";
import { SignalStateEventAssessmentCard } from "../components/assessments/signal-state-event-assessment";
import { SignalStateAssessmentCard } from "../components/assessments/signal-state-assessment";
import { NotificationsTable } from "../components/notifications/notifications-table";
import React, { useEffect, useState, useRef } from "react";
import { useDashboardContext } from "../contexts/dashboard-context";
import AssessmentsApi from "../apis/assessments-api";
import { useSession } from "next-auth/react";

const tabs = [
  {
    label: "All",
    value: "all",
    description: "All Assessments",
  },
  {
    label: "Signal State Assessment",
    value: "SignalStateAssessment",
    description: "Signal State Assessment",
  },
  {
    label: "Lane Direction of Travel Assessment",
    value: "LaneDirectionOfTravelAssessment",
    description: "Lane Direction of Travel Assessment",
  },
  {
    label: "Connection of Travel Assessment",
    value: "ConnectionOfTravelAssessment",
    description: "Connection of Travel Assessment",
  },
  {
    label: "Vehicle Stop Assessment",
    value: "VehicleStopAssessment",
    description: "Vehicle Stop Assessment",
  },
];

const applyFilters = (parameters, filter) =>
  parameters.filter((parameter) => {
    if (filter.query) {
      let queryMatched = false;
      const properties = ["notificationType", "notificationText"];
      properties.forEach((property) => {
        if (parameter[property].toLowerCase().includes(filter.query.toLowerCase())) {
          queryMatched = true;
        }
      });

      if (!queryMatched) {
        return false;
      }
    }

    if (filter.tab === "all") {
      return true;
    }

    return parameter["notificationType"] == filter.tab;
  });

const applyPagination = (parameters, page, rowsPerPage) =>
  parameters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const Page = () => {
  const queryRef = useRef<TextFieldProps>(null);
  const [notifications, setNotifications] = useState<SpatBroadcastRateNotification>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentDescription, setCurrentDescription] = useState("");
  const [filter, setFilter] = useState({
    query: "",
    tab: currentTab,
  });
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
    if (intersectionId && roadRegulatorId && session?.accessToken) {
      setSignalStateAssessment(
        (await AssessmentsApi.getAssessment(
          session?.accessToken,
          "signal_state_assessment",
          intersectionId.toString(),
          roadRegulatorId.toString()
        )) as SignalStateAssessment
      );
      setSignalStateEventAssessment(
        (await AssessmentsApi.getAssessment(
          session?.accessToken,
          "signal_state_event_assessment",
          intersectionId.toString(),
          roadRegulatorId.toString()
        )) as SignalStateEventAssessment
      );
      setConnectionOfTravelAssessment(
        (await AssessmentsApi.getAssessment(
          session?.accessToken,
          "connection_of_travel",
          intersectionId.toString(),
          roadRegulatorId.toString()
        )) as ConnectionOfTravelAssessment
      );
      setLaneDirectionOfTravelAssessment(
        (await AssessmentsApi.getAssessment(
          session?.accessToken,
          "lane_direction_of_travel",
          intersectionId.toString(),
          roadRegulatorId.toString()
        )) as LaneDirectionOfTravelAssessment
      );
    }
  };

  const updateNotifications = () => {
    if (intersectionId && session?.accessToken) {
      setNotifications(
        NotificationApi.getActiveNotifications({
          token: session?.accessToken,
          intersection_id: intersectionId.toString(),
        })
      );
    }
  };

  useEffect(() => {
    updateNotifications();
    getAssessments();
  }, [intersectionId]);

  useEffect(() => {
    updateDescription();
  }, [currentTab]);

  const updateDescription = () => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].value === currentTab) {
        setCurrentDescription(tabs[i].description);
      }
    }
  };

  // Usually query is done on backend with indexing solutions
  const filteredNotifications = applyFilters(notifications, filter);

  return (
    <>
      <Head>
        <title>Assessments | Material Kit</title>
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
              <ConnectionOfTravelAssessmentCard assessment={connectionOfTravelAssessment} small={false} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <LaneDirectionOfTravelAssessmentCard assessment={laneDirectionOfTravelAssessment} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <SignalStateEventAssessmentCard assessment={signalStateEventAssessment} />
            </Grid>
            <Grid item xl={3} lg={3} sm={6} xs={12}>
              <SignalStateAssessmentCard assessment={signalStateAssessment} />
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
