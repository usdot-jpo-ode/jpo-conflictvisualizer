import Head from "next/head";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { AssessmentListResults } from "../components/assessments/assessment-list-results";
import { DashboardLayout } from "../components/dashboard-layout";
import { Refresh as RefreshIcon } from "../icons/refresh";
import { Search as SearchIcon } from "../icons/search";
import NotificationApi from "../apis/notification-api";
import { ConnectionOfTravelAssessmentCard } from "../components/assessments/connection-of-travel-assessment";
import { LaneDirectionOfTravelAssessmentCard } from "../components/assessments/lane-direction-of-travel-assessment";
import { SignalStateAssessmentCard } from "../components/assessments/signal-state-assessment";
import { NotificationsTable } from "../components/notifications/notifications-table";
import React, { useEffect, useState, useRef } from "react";
import { useDashboardContext } from "../contexts/dashboard-context";
import AssessmentsApi from "../apis/assessments-api";

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
  const [acceptedNotifications, setAcceptedNotifications] = useState<String[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentDescription, setCurrentDescription] = useState("");
  const [filter, setFilter] = useState({
    query: "",
    tab: currentTab,
  });
  const { intersectionId: dbIntersectionId } = useDashboardContext();
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

  const getAssessments = async () => {
    setSignalStateAssessment(
      (await AssessmentsApi.getAssessment(
        "token",
        "signal_state_assessment",
        dbIntersectionId ?? 12109
      )) as SignalStateAssessment
    );
    setSignalStateEventAssessment(
      (await AssessmentsApi.getAssessment(
        "token",
        "signal_state_event_assessment",
        dbIntersectionId ?? 12109
      )) as SignalStateEventAssessment
    );
    setConnectionOfTravelAssessment(
      (await AssessmentsApi.getAssessment(
        "token",
        "connection_of_travel",
        dbIntersectionId ?? 12109
      )) as ConnectionOfTravelAssessment
    );
    setLaneDirectionOfTravelAssessment(
      (await AssessmentsApi.getAssessment(
        "token",
        "lane_direction_of_travel",
        dbIntersectionId ?? 12109
      )) as LaneDirectionOfTravelAssessment
    );
  };

  const updateNotifications = () => {
    setNotifications(NotificationApi.getActiveNotifications({ token: "", intersection_id: "12109" }));
  };

  useEffect(() => {
    updateNotifications();
    getAssessments();
  }, []);

  useEffect(() => {
    updateDescription();
  }, [currentTab]);

  const handleTabsChange = (event, value) => {
    const updatedFilter = { ...filter, tab: value };
    setCurrentTab(value);
    setFilter(updatedFilter);
    setPage(0);
    setCurrentTab(value);
  };

  const handleQueryChange = (event) => {
    event.preventDefault();
    setFilter((prevState) => ({
      ...prevState,
      query: queryRef.current?.value as string,
    }));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const updateDescription = () => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].value === currentTab) {
        setCurrentDescription(tabs[i].description);
      }
    }
  };

  // Usually query is done on backend with indexing solutions
  const filteredNotifications = applyFilters(notifications, filter);
  const paginatedNotifications = applyPagination(filteredNotifications, page, rowsPerPage);

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
