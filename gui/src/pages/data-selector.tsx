import { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import EventsApi from "../apis/events-api";
import AssessmentsApi from "../apis/assessments-api";
import MessageMonitorApi from "../apis/mm-api";
import GraphsApi from "../apis/graphs-api";
import { DashboardLayout } from "../components/dashboard-layout";
import { DataSelectorEditForm } from "../components/data-selector/data-selector-edit-form";
import { EventDataTable } from "../components/data-selector/event-data-table";
import { AssessmentDataTable } from "../components/data-selector/assessment-data-table";
import { useDashboardContext } from "../contexts/dashboard-context";
import { useSession } from "next-auth/react";
import { DataVisualizer } from "../components/data-selector/data-visualizer";
import toast from "react-hot-toast";
import MapDialog from "../components/intersection-selector/intersection-selector-dialog";
import { useQueryContext } from "../contexts/query-context";

const DataSelectorPage = () => {
  //   const [type, setType] = useState("");
  //   const [events, setEvents] = useState<MessageMonitor.Event[]>([]);
  //   const [assessments, setAssessments] = useState<Assessment[]>([]);
  //   const [graphData, setGraphData] = useState<Array<GraphArrayDataType>>([]);
  const { intersectionId } = useDashboardContext();
  //   const [openMapDialog, setOpenMapDialog] = useState(false);
  //   const [roadRegulatorIntersectionIds, setRoadRegulatorIntersectionIds] = useState<{
  //     [roadRegulatorId: number]: number[];
  //   }>({});
  const { data: session } = useSession();
  const {
    type,
    events,
    assessments,
    graphData,
    openMapDialog,
    roadRegulatorIntersectionIds,
    setType,
    setEvents,
    setAssessments,
    setGraphData,
    setOpenMapDialog,
    setRoadRegulatorIntersectionIds,
  } = useQueryContext();

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

  useEffect(() => {
    if (session?.accessToken) {
      MessageMonitorApi.getIntersections({ token: session?.accessToken }).then((intersections) => {
        const roadRegulatorIntersectionIds: { [roadRegulatorId: number]: number[] } = {};
        for (const intersection of intersections) {
          if (!roadRegulatorIntersectionIds[intersection.roadRegulatorID]) {
            roadRegulatorIntersectionIds[intersection.roadRegulatorID] = [];
          }
          roadRegulatorIntersectionIds[intersection.roadRegulatorID].push(intersection.intersectionID);
        }
        setRoadRegulatorIntersectionIds(roadRegulatorIntersectionIds);
      });
    } else {
      console.error("Did not attempt to update user automatically. Access token:", Boolean(session?.accessToken));
    }
  }, [session?.accessToken]);

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
        const eventPromises: Promise<MessageMonitor.Event[]>[] = [];
        for (let i = 0; i < eventTypes.length; i++) {
          const eventType = eventTypes[i];
          const promise = EventsApi.getEvents(session?.accessToken, eventType, intersectionId, startDate, endTime);
          eventPromises.push(promise);
        }
        const allEventsPromise = Promise.all(eventPromises);
        toast.promise(allEventsPromise, {
          loading: `Loading event data`,
          success: `Successfully got event data`,
          error: `Failed to get event data. Please see console`,
        });

        try {
          const allEvents = await allEventsPromise;
          allEvents.forEach((event) => {
            events.push(...event);
          });
        } catch (e) {
          console.error(`Failed to load event data because ${e}`);
        }

        events.sort((a, b) => a.eventGeneratedAt - b.eventGeneratedAt);
        setEvents(events);
        // setAssessments([]);
        return events;
      case "assessments":
        const assessments: Assessment[] = [];
        const assessmentPromises: Promise<Assessment[]>[] = [];
        // iterate through each event type in a for loop and add the events to events array
        for (let i = 0; i < assessmentTypes.length; i++) {
          const assessmentType = assessmentTypes[i];
          const promise = AssessmentsApi.getAssessments(
            session?.accessToken,
            assessmentType,
            intersectionId,
            undefined,
            startDate,
            endTime
          );
          assessmentPromises.push(promise);
        }

        const allAssessmentsPromise = Promise.all(assessmentPromises);
        toast.promise(allAssessmentsPromise, {
          loading: `Loading assessment data`,
          success: `Successfully got assessment data`,
          error: `Failed to get assessment data`,
        });

        try {
          const allAssessments = await allAssessmentsPromise;
          allAssessments.forEach((assessment) => {
            assessments.push(...assessment);
          });
        } catch (e) {
          console.error(`Failed to load assessment data because ${e}`);
        }
        assessments.sort((a, b) => a.assessmentGeneratedAt - b.assessmentGeneratedAt);
        setAssessments(assessments);
        // setEvents([]);
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
    try {
      if (term instanceof Object || term instanceof Array) {
        return `"${JSON.stringify(term).replaceAll('"', '""')}"`;
      }
      if (term.match && term.match(/,|"/)) {
        return `"${term.replaceAll('"', '""')}"`;
      } else {
        return term;
      }
    } catch (e) {
      console.error(e);
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
            <DataSelectorEditForm
              onQuery={query}
              onVisualize={onVisualize}
              roadRegulatorIntersectionIds={roadRegulatorIntersectionIds}
              dbIntersectionId={intersectionId}
            />
          </Box>
        </Container>
        <Container sx={{ mt: 5, alignItems: "center", display: "flex" }}>
          {type == "events" && (
            <EventDataTable
              events={events}
              onDownload={() => downloadEventCsvFiles(events)}
              onDownloadJson={() =>
                downloadFile(events.map((e) => JSON.stringify(e)).join("\n"), "cimms_events_export")
              }
            />
          )}
          {type == "assessments" && (
            <AssessmentDataTable
              assessments={assessments}
              onDownload={() => downloadAssessmentCsvFiles(assessments)}
              onDownloadJson={() =>
                downloadFile(assessments.map((e) => JSON.stringify(e)).join("\n"), "cimms_assessments_export")
              }
            />
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
      <MapDialog
        open={openMapDialog}
        onClose={() => {
          setOpenMapDialog(false);
        }}
        intersections={[]}
      />
    </>
  );
};

DataSelectorPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DataSelectorPage;
