import { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import EventsApi from "../apis/events-api";
import AssessmentsApi from "../apis/assessments-api";
import GraphsApi from "../apis/graphs-api";
import { DashboardLayout } from "../components/dashboard-layout";
import { DataSelectorEditForm } from "../components/data-selector/data-selector-edit-form";
import { EventDataTable } from "../components/data-selector/event-data-table";
import { AssessmentDataTable } from "../components/data-selector/assessment-data-table";
import { useDashboardContext } from "../contexts/dashboard-context";
import { useSession } from "next-auth/react";
import { DataVisualizer } from "../components/data-selector/data-visualizer";

const DataSelectorPage = () => {
  const [type, setType] = useState("");
  const [events, setEvents] = useState<MessageMonitor.Event[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [graphData, setGraphData] = useState<Array<GraphArrayDataType>>([]);
  const { intersectionId } = useDashboardContext();
  const { data: session } = useSession();

  const getPaddedTimestamp = () => {
    const date = new Date();
    // create padded timestamp like YYMMdd_HHMMSS
    return `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
      .getDate()
      .toString()
      .padStart(2, "0")}_${date.getHours().toString().padStart(2, "0")}${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}${date.getSeconds().toString().padStart(2, "0")}`;
  };

  const downloadFile = (contents: string, name: string, extension: string = "txt") => {
    const element = document.createElement("a");
    const file = new Blob([contents], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${name}_${getPaddedTimestamp()}.${extension}`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const query = async ({
    type,
    intersectionId,
    roadRegulatorId,
    startDate,
    endTime,
    eventTypes,
    assessmentTypes,
    bsmVehicleId,
  }) => {
    if (!session?.accessToken) {
      console.error("Did not attempt to query for data. Access token:", Boolean(session?.accessToken));
      return;
    }
    setType(type);
    switch (type) {
      case "events":
        const events: MessageMonitor.Event[] = [];
        // iterate through each event type in a for loop and add the events to events array
        for (let i = 0; i < eventTypes.length; i++) {
          const eventType = eventTypes[i];
          const event = await EventsApi.getEvent(session?.accessToken, eventType, intersectionId, startDate, endTime);
          events.push(...event);
        }
        setEvents(events);
        setAssessments([]);
        return events;
      case "assessments":
        const assessments: Assessment[] = [];
        // iterate through each event type in a for loop and add the events to events array
        for (let i = 0; i < assessmentTypes.length; i++) {
          const eventType = assessmentTypes[i];
          const event = await AssessmentsApi.getAssessment(
            session?.accessToken,
            eventType,
            intersectionId,
            undefined,
            startDate,
            endTime
          );
          if (event) assessments.push({ ...event });
        }
        setAssessments(assessments);
        setEvents([]);
        return assessments;
    }
    return;
  };

  const onVisualize = async ({
    intersectionId,
    roadRegulatorId,
    startDate,
    endTime,
    eventTypes,
  }: {
    intersectionId: number;
    roadRegulatorId: number;
    startDate: Date;
    endTime: Date;
    eventTypes: string[];
  }) => {
    if (!session?.accessToken) {
      console.error("Did not attempt to visualize data counts. Access token:", Boolean(session?.accessToken));
      return;
    }
    setGraphData(
      await GraphsApi.getGraphData({
        token: session?.accessToken,
        intersection_id: intersectionId,
        startTime: startDate,
        endTime: endTime,
        event_types: eventTypes,
      })
    );
    // setGraphData(
    //   await GraphsApi.getGraphData({
    //     token: session?.accessToken,
    //     intersection_id: intersectionId,
    //     data_type: type,
    //     startTime: startDate,
    //     endTime: new Date(startDate.getTime() + timeRange * 60 * 1000),
    //   })
    // );
  };

  function sanitizeCsvString(term) {
    if (term instanceof Object || term instanceof Array) {
      return `"${JSON.stringify(term).replaceAll('"', '""')}"`;
    }
    if (term.match && term.match(/,|"/)) {
      return `"${term.replaceAll('"', '""')}"`;
    } else {
      return term;
    }
  }

  const convertToCsv = (data: any[]) => {
    const csvRows: string[] = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => row[header]?.toString() ?? "undefined");
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  };

  const downloadEventCsvFiles = (data: MessageMonitor.Event[]) => {
    const csvRows: { [id: string]: string[] } = {};
    for (const event of data) {
      if (!csvRows[event.eventType]) {
        csvRows[event.eventType] = [Object.keys(event).join(",")];
      }
      csvRows[event.eventType].push(Object.values(event).map(sanitizeCsvString).join(","));
    }
    for (const eventType in csvRows) {
      downloadFile(csvRows[eventType].join("\n"), `cimms_events_${eventType}_export`, "csv");
    }
  };

  const downloadAssessmentCsvFiles = (data: Assessment[]) => {
    const csvRows: { [id: string]: string[] } = {};
    for (const event of data) {
      if (!csvRows[event.assessmentType]) {
        csvRows[event.assessmentType] = [Object.keys(event).join(",")];
      }
      //   switch(event.assessmentType) {
      //     case "SignalStateAssessment":
      //         const signalStateAssessment = event as SignalStateAssessment;
      //         signalStateAssessment
      //         break;
      //         case "LaneDirectionOfTravelAssessment":
      //             break;
      //             case "ConnectionOfTravelAssessment":
      //                 break;
      //                 case "VehicleStopAssessment":
      //                     break;
      //   }
      csvRows[event.assessmentType].push(Object.values(event).map(sanitizeCsvString).join(","));
    }
    for (const assessmentType in csvRows) {
      downloadFile(csvRows[assessmentType].join("\n"), `cimms_assessments_${assessmentType}_export`, "csv");
    }
  };

  return (
    <>
      <Head>
        <title>Data Selector</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div>
              <Typography noWrap variant="h4">
                Query
              </Typography>
            </div>
          </Box>
          <Box mt={3}>
            <DataSelectorEditForm onQuery={query} onVisualize={onVisualize} dbIntersectionId={intersectionId} />
          </Box>
        </Container>
        <Container sx={{ mt: 5, alignItems: "center", display: "flex" }}>
          {type == "events" && <EventDataTable events={events} onDownload={() => downloadEventCsvFiles(events)} />}
          {type == "assessments" && (
            <AssessmentDataTable events={assessments} onDownload={() => downloadAssessmentCsvFiles(assessments)} />
          )}
          {graphData.length > 0 && (
            <DataVisualizer
              data={graphData}
              onDownload={() => {
                return downloadFile(convertToCsv(graphData), "cimms_graph_data_export", "csv");
              }}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

DataSelectorPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DataSelectorPage;
