import React, { useState, useEffect } from "react";
import Map, { Source, Layer } from "react-map-gl";

import { Container, Col } from "reactstrap";

import { Paper, Box, IconButton, Typography, breadcrumbsClasses } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { styled } from "@mui/material/styles";
import { CustomTable } from "./custom-table";
import { format } from "date-fns";

// import mapMessageData from "./processed_map_v4.json";
import type { LayerProps } from "react-map-gl";
import ControlPanel from "./control-panel";
import MessageMonitorApi from "../../apis/mm-api";
import { useDashboardContext } from "../../contexts/dashboard-context";
import { Marker } from "mapbox-gl";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  //border: `1px solid ${theme.palette.divider}`,
  // '&:not(:last-child)': {
  //   borderBottom: 0,
  // },
  // '&:before': {
  //   display: 'none',
  // },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.8rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  minHeight: 0,
  paddingLeft: 10,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

export const SidePanel = (props) => {
  const {
    laneInfo,
    signalGroups,
    bsms,
    notification,
    selectedFeature,
  }: {
    laneInfo: ConnectingLanesFeatureCollection | undefined;
    signalGroups: SpatSignalGroup[];
    bsms: BsmFeatureCollection;
    notification: MessageMonitor.Notification;
    selectedFeature: any;
  } = props;

  const [open, setOpen] = useState(true);

  const getNotificationTable = (notification: MessageMonitor.Notification) => {
    if (!notification) return <Typography>No Data</Typography>;
    const fields = [
      ["time", format(new Date(notification.notificationGeneratedAt), "yyyy-MM-dd HH:mm:ss")],
    ];
    switch (notification.notificationType) {
      case "SpatBroadcastRateNotification":
        break;
      case "SignalStateConflictNotification":
        break;
      case "SignalGroupAlignmentNotification":
        break;
      case "MapBroadcastRateNotification":
        break;
      case "LaneDirectionOfTravelNotification":
        break;
      case "IntersectionReferenceAlignmentNotification":
        break;
      case "ConnectionOfTravelNotification":
        fields.push([
          "ingress Lane ID",
          notification?.assessment?.connectionOfTravelAssessment?.[0]?.ingressLaneID,
        ]);
        fields.push([
          "egress Lane ID",
          notification?.assessment?.connectionOfTravelAssessment?.[0]?.egressLaneID,
        ]);
        fields.push([
          "event count",
          notification?.assessment?.connectionOfTravelAssessment?.[0]?.eventCount,
        ]);
        break;
    }
    return (
      <CustomTable headers={["Field", "Value"]} data={notification == undefined ? [] : fields} />
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 10,
        top: 0,
        bottom: 0,
        right: 0,
        width: open ? 450 : 50,
        fontSize: "16px",
        overflow: "auto",
        scrollBehavior: "auto",
      }}
    >
      <Box style={{ position: "relative", height: "100%", width: "100%" }}>
        <Paper sx={{ height: "100%", width: "100%" }}>
          <Box>
            <IconButton
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            >
              {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            {!open ? (
              <Box></Box>
            ) : (
              <>
                <Typography variant="h5" sx={{ px: 2 }}>
                  Information Panel
                </Typography>
                <Accordion disableGutters>
                  <AccordionSummary>
                    <Typography variant="h5">Lanes</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mt: 1 }}>
                      <CustomTable
                        headers={["ingress", "egress", "status"]}
                        data={
                          laneInfo?.features?.map((lane) => [
                            lane.properties.ingressLaneId,
                            lane.properties.egressLaneId,
                            signalGroups?.find(
                              (grp) => grp.signalGroup == lane.properties.signalGroupId
                            )?.state ?? "no data",
                          ]) ?? []
                        }
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion disableGutters>
                  <AccordionSummary>
                    <Typography variant="h5">BSMs</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mt: 1 }}>
                      <CustomTable
                        headers={["time", "speed", "heading"]}
                        data={
                          bsms?.features.map((bsm) => [
                            bsm.properties.secMark / 1000,
                            bsm.properties.speed,
                            bsm.properties.heading,
                          ]) ?? []
                        }
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion disableGutters>
                  <AccordionSummary>
                    <Typography variant="h5">Notification</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="h6">{notification?.notificationText}</Typography>
                    <Box sx={{ mt: 1 }}>{getNotificationTable(notification)}</Box>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </div>
  );
};
