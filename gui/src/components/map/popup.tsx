import React, { useState, useEffect } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";

import { Container, Col } from "reactstrap";

import { Paper, Box, Typography } from "@mui/material";
import { CustomTable } from "./custom-table";

export const CustomPopup = (props) => {
  console.log("PROPS", props);

  const getPopupContent = (feature: any) => {
    switch (feature.layer.id) {
      case "bsm":
        let bsm = feature.properties;
        return (
          <Box>
            <Typography>BSM</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[
                ["Id", bsm.id],
                ["Message Count", bsm.msgCnt],
                ["Time", bsm.secMark / 1000],
                ["Speed", bsm.speed],
                ["Heading", bsm.heading],
              ]}
            />
          </Box>
        );
      case "mapMessage":
        let map = feature.properties;
        let connectedObjs: any[] = [];
        console.log("Map MESSAGE", map.connectsTo);
        JSON.parse(map?.connectsTo ?? "[]")?.forEach((connectsTo) => {
          connectedObjs.push(["Connected Lane", connectsTo.connectingLane.lane]);
          connectedObjs.push(["Signal Group", connectsTo.signalGroup]);
          connectedObjs.push(["Connection ID", connectsTo.connectionID]);
        });
        return (
          <Box>
            <Typography>MAP Lane</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[["Lane Id", map.laneId], ...connectedObjs]}
            />
          </Box>
        );

      case "connectingLanes":
        return (
          <Box>
            <Typography>Connecting Lane</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[
                ["State", "PROTECTED_MOVEMENT_ALLOWED"],
                ["Color", "Green"],
                ["Ingress Lane", feature.properties?.ingressLaneId],
                ["Egress Lane", feature.properties?.egressLaneId],
                ["Signal Group", feature.properties?.signalGroupId],
              ]}
            />
          </Box>
        );
      case "connectingLanesYellow":
        return (
          <Box>
            <Typography>Connecting Lane</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[
                ["State", "PROTECTED_CLEARANCE"],
                ["Color", "Yellow"],
                ["Ingress Lane", feature.properties?.ingressLaneId],
                ["Egress Lane", feature.properties?.egressLaneId],
                ["Signal Group", feature.properties?.signalGroupId],
              ]}
            />
          </Box>
        );
      case "connectingLanesInactive":
        return (
          <Box>
            <Typography>Connecting Lane</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[
                ["State", "STOP_AND_REMAIN"],
                ["Color", "Red"],
                ["Ingress Lane", feature.properties?.ingressLaneId],
                ["Egress Lane", feature.properties?.egressLaneId],
                ["Signal Group", feature.properties?.signalGroupId],
              ]}
            />
          </Box>
        );
      case "connectingLanesMissing":
        return (
          <Box>
            <Typography>Connecting Lane</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[
                ["State", "unknown"],
                ["Color", "unknown"],
                ["Ingress Lane", feature.properties?.ingressLaneId],
                ["Egress Lane", feature.properties?.egressLaneId],
                ["Signal Group", feature.properties?.signalGroupId],
              ]}
            />
          </Box>
        );
      case "signalStatesGreen":
        return (
          <Box>
            <Typography>Signal State</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[
                ["State", "PROTECTED_MOVEMENT_ALLOWED"],
                ["Color", "Green"],
                ["Signal Group", feature.properties?.signalGroup],
              ]}
            />
          </Box>
        );
      case "signalStatesYellow":
        return (
          <Box>
            <Typography>Signal State</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[
                ["State", "PROTECTED_CLEARANCE"],
                ["Color", "Yellow"],
                ["Signal Group", feature.properties?.signalGroup],
              ]}
            />
          </Box>
        );
      case "signalStatesRed":
        return (
          <Box>
            <Typography>Signal State</Typography>
            <CustomTable
              headers={["Field", "Value"]}
              data={[
                ["State", "STOP_AND_REMAIN"],
                ["Color", "Red"],
                ["Signal Group", feature.properties?.signalGroup],
              ]}
            />
          </Box>
        );
      case "invalidLaneCollection":
        let invalidLaneCollection = feature.properties;
        return <Typography>{invalidLaneCollection.description}</Typography>;
    }
    return <Typography>No Data</Typography>;
  };

  return (
    <Popup
      longitude={props.selectedFeature.clickedLocation.lng}
      latitude={props.selectedFeature.clickedLocation.lat}
      anchor="bottom"
      onClose={props.onClose}
      onOpen={() => {
        console.log("OPENING");
      }}
      maxWidth={"500px"}
    >
      {getPopupContent(props.selectedFeature.feature)}
    </Popup>
  );
};
