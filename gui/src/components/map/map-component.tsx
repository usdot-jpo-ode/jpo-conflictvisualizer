import React, { useState, useEffect } from "react";
import Map, { Source, Layer } from "react-map-gl";

import { Container, Col } from "reactstrap";

import { Paper, Box, Typography } from "@mui/material";

// import mapMessageData from "./processed_map_v4.json";
import type { CircleLayer, LayerProps, LineLayer, SymbolLayer } from "react-map-gl";
import ControlPanel from "./control-panel";
import MessageMonitorApi from "../../apis/mm-api";
import EventsApi from "../../apis/events-api";
import NotificationApi from "../../apis/notification-api";
import { SidePanel } from "./side-panel";
import { CustomPopup } from "./popup";
import getConfig from "next/config";
import { generateColorDictionary, generateMapboxStyleExpression } from "./utilities/colors";
import { MapLegend } from "./map-legend";
import toast from "react-hot-toast";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { CompatClient, IMessage, Stomp } from "@stomp/stompjs";
import { set } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken } from "../../slices/userSlice";
import {
  selectBsmLayerStyle,
  selectConnectingLanesLabelsLayerStyle,
  selectConnectingLanesLayerStyle,
  selectMapLegendColors,
  selectMapMessageLabelsLayerStyle,
  selectMapMessageLayerStyle,
  selectMarkerLayerStyle,
  selectSignalStateLayerStyle,
  setBsmCircleColor,
  setBsmLegendColors,
} from "./map-layer-style-slice";
import { getBearingBetweenPoints, getTimeRange } from "./utilities/map-utils";
import {
  MAP_LAYERS,
  cleanUpLiveStreaming,
  clearHoveredFeature,
  clearSelectedFeature,
  initializeLiveStreaming,
  maybeUpdateSliderValue,
  onMapClick,
  onMapMouseEnter,
  onMapMouseLeave,
  onMapMouseMove,
  onTimeQueryChanged,
  pullInitialData,
  renderIterative_Bsm,
  renderIterative_Map,
  renderIterative_Spat,
  selectAllInteractiveLayerIds,
  selectBsmData,
  selectConnectingLanes,
  selectCurrentBsmData,
  selectCurrentBsms,
  selectCurrentMapData,
  selectCurrentSignalGroups,
  selectCurrentSpatData,
  selectCursor,
  selectFilteredSurroundingEvents,
  selectFilteredSurroundingNotifications,
  selectHoveredFeature,
  selectImportedMessageData,
  selectIntersectionId,
  selectLaneLabelsVisible,
  selectLayersVisible,
  selectLiveDataActive,
  selectLoadInitialDataTimeoutId,
  selectLoadOnNull,
  selectMapData,
  selectMapSignalGroups,
  selectMapSpatTimes,
  selectQueryParams,
  selectRawData,
  selectRenderTimeInterval,
  selectRoadRegulatorId,
  selectSelectedFeature,
  selectShowPopupOnHover,
  selectSigGroupLabelsVisible,
  selectSignalStateData,
  selectSliderValue,
  selectSourceData,
  selectSourceDataType,
  selectSpatSignalGroups,
  selectSurroundingNotifications,
  selectTimeWindowSeconds,
  selectViewState,
  setLoadInitialdataTimeoutId,
  setViewState,
  updateQueryParams,
  updateRenderTimeInterval,
  updateRenderedMapState,
} from "./map-slice";
import {
  addConnections,
  createMarkerForNotification,
  generateSignalStateFeatureCollection,
} from "./utilities/message-utils";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store";
const { publicRuntimeConfig } = getConfig();

const generateQueryParams = (
  source: MessageMonitor.Notification | MessageMonitor.Event | Assessment | timestamp | undefined,
  sourceDataType: "notification" | "event" | "assessment" | "timestamp" | undefined
) => {
  const startOffset = 1000 * 60 * 1;
  const endOffset = 1000 * 60 * 1;

  switch (sourceDataType) {
    case "notification":
      const notification = source as MessageMonitor.Notification;
      return {
        startDate: new Date(notification.notificationGeneratedAt - startOffset),
        endDate: new Date(notification.notificationGeneratedAt + endOffset),
        eventDate: new Date(notification.notificationGeneratedAt),
        vehicleId: undefined,
      };
    case "event":
      const event = source as MessageMonitor.Event;
      return {
        startDate: new Date(event.eventGeneratedAt - startOffset),
        endDate: new Date(event.eventGeneratedAt + endOffset),
        eventDate: new Date(event.eventGeneratedAt),
        vehicleId: undefined,
      };
    case "assessment":
      const assessment = source as Assessment;
      return {
        startDate: new Date(assessment.assessmentGeneratedAt - startOffset),
        endDate: new Date(assessment.assessmentGeneratedAt + endOffset),
        eventDate: new Date(assessment.assessmentGeneratedAt),
        vehicleId: undefined,
      };
    case "timestamp":
      const ts = (source as timestamp).timestamp;
      return {
        startDate: new Date(ts - startOffset),
        endDate: new Date(ts + endOffset),
        eventDate: new Date(ts),
        vehicleId: undefined,
      };
    default:
      return {
        startDate: new Date(Date.now() - startOffset),
        endDate: new Date(Date.now() + endOffset),
        eventDate: new Date(Date.now()),
        vehicleId: undefined,
      };
  }
};

type timestamp = {
  timestamp: number;
};

type MyProps = {
  sourceData: MessageMonitor.Notification | MessageMonitor.Event | Assessment | timestamp | undefined;
  sourceDataType: "notification" | "event" | "assessment" | "timestamp" | undefined;
  intersectionId: number | undefined;
  roadRegulatorId: number | undefined;
  loadOnNull?: boolean;
};

const MapTab = (props: MyProps) => {
  const MAPBOX_API_TOKEN = publicRuntimeConfig.MAPBOX_TOKEN!;
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();

  // userSlice
  const authToken = useSelector(selectAuthToken);

  const mapMessageLayerStyle = useSelector(selectMapMessageLayerStyle);
  const mapMessageLabelsLayerStyle = useSelector(selectMapMessageLabelsLayerStyle);
  const connectingLanesLayerStyle = useSelector(selectConnectingLanesLayerStyle);
  const connectingLanesLabelsLayerStyle = useSelector(selectConnectingLanesLabelsLayerStyle);
  const markerLayerStyle = useSelector(selectMarkerLayerStyle);
  const bsmLayerStyle = useSelector(selectBsmLayerStyle);
  const signalStateLayerStyle = useSelector(selectSignalStateLayerStyle);

  const allInteractiveLayerIds = useSelector(selectAllInteractiveLayerIds);
  const queryParams = useSelector(selectQueryParams);
  const mapData = useSelector(selectMapData);
  const bsmData = useSelector(selectBsmData);
  const mapSignalGroups = useSelector(selectMapSignalGroups);
  const signalStateData = useSelector(selectSignalStateData);
  const spatSignalGroups = useSelector(selectSpatSignalGroups);
  const currentSignalGroups = useSelector(selectCurrentSignalGroups);
  const currentBsms = useSelector(selectCurrentBsms);
  const connectingLanes = useSelector(selectConnectingLanes);
  const filteredSurroundingEvents = useSelector(selectFilteredSurroundingEvents);
  const filteredSurroundingNotifications = useSelector(selectFilteredSurroundingNotifications);
  const viewState = useSelector(selectViewState);
  const timeWindowSeconds = useSelector(selectTimeWindowSeconds);
  const sliderValue = useSelector(selectSliderValue);
  const renderTimeInterval = useSelector(selectRenderTimeInterval);
  const hoveredFeature = useSelector(selectHoveredFeature);
  const selectedFeature = useSelector(selectSelectedFeature);
  const sigGroupLabelsVisible = useSelector(selectSigGroupLabelsVisible);
  const laneLabelsVisible = useSelector(selectLaneLabelsVisible);
  const showPopupOnHover = useSelector(selectShowPopupOnHover);
  const cursor = useSelector(selectCursor);
  const loadInitialDataTimeoutId = useSelector(selectLoadInitialDataTimeoutId);
  const liveDataActive = useSelector(selectLiveDataActive);

  const mapRef = React.useRef<any>(null);
  const [rawData, setRawData] = useState<{
    map?: ProcessedMap[];
    spat?: ProcessedSpat[];
    bsm?: BsmFeatureCollection;
    notification?: MessageMonitor.Notification;
    event?: MessageMonitor.Event;
    assessment?: Assessment;
  }>({});
  const [bsmTrailLength, setBsmTrailLength] = useState<number>(5);
  const [currentProcessedSpatData, setCurrentProcessedSpatData] = useState<ProcessedSpat[]>([]);

  useEffect(() => {
    console.debug("SELECTED FEATURE", selectedFeature);
  }, [selectedFeature]);

  useEffect(() => {
    if (props.intersectionId != queryParams.intersectionId || props.roadRegulatorId != queryParams.roadRegulatorId) {
      dispatch(
        updateQueryParams({
          intersectionId: props.intersectionId,
          roadRegulatorId: props.roadRegulatorId,
        })
      );
      if (liveDataActive && authToken && props.roadRegulatorId && props.intersectionId) {
        cleanUpLiveStreaming();
        dispatch(
          initializeLiveStreaming({
            token: authToken,
            roadRegulatorId: props.roadRegulatorId,
            intersectionId: props.intersectionId,
          })
        );
      }
    }
  }, [props.intersectionId, props.roadRegulatorId]);

  useEffect(() => {
    dispatch(
      updateQueryParams({
        ...generateQueryParams(props.sourceData, props.sourceDataType),
        intersectionId: props.intersectionId,
        roadRegulatorId: props.roadRegulatorId,
        resetTimeWindow: true,
      })
    );
    if (!liveDataActive) {
      dispatch(setTimeWindowSeconds(60));
    }
  }, [props.sourceData]);

  useEffect(() => {
    if (liveDataActive) {
      return;
    }
    if (loadInitialDataTimeoutId) {
      clearTimeout(loadInitialDataTimeoutId);
    }
    dispatch(setLoadInitialdataTimeoutId(setTimeout(() => dispatch(pullInitialData()), 500)));
  }, [queryParams]);

  useEffect(() => {
    if (!mapSignalGroups || !spatSignalGroups) {
      console.debug("BSM Loading: No map or SPAT data", mapSignalGroups, spatSignalGroups);
      return;
    }

    dispatch(updateRenderedMapState());
  }, [bsmData, mapSignalGroups, renderTimeInterval, spatSignalGroups]);

  useEffect(() => {
    dispatch(updateRenderTimeInterval());
  }, [sliderValue, queryParams, timeWindowSeconds]);

  useEffect(() => {
    if (liveDataActive) {
      if (authToken && props.roadRegulatorId && props.intersectionId) {
        dispatch(
          initializeLiveStreaming({
            token: authToken,
            roadRegulatorId: props.roadRegulatorId,
            intersectionId: props.intersectionId,
          })
        );
        if (bsmTrailLength > 15) setBsmTrailLength(5);
      } else {
        console.error(
          "Did not attempt to update notifications. Access token:",
          authToken,
          "Intersection ID:",
          props.intersectionId,
          "Road Regulator ID:",
          props.roadRegulatorId
        );
      }
    } else {
      if (bsmTrailLength < 15) setBsmTrailLength(20);
      dispatch(cleanUpLiveStreaming());
    }
  }, [liveDataActive]);

  return (
    <Container fluid={true} style={{ width: "100%", height: "100%", display: "flex" }}>
      <Col className="mapContainer" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "0px 0px 6px 12px",
            marginTop: "6px",
            marginLeft: "35px",
            position: "absolute",
            zIndex: 10,
            top: 0,
            left: 0,
            // width: 1200,
            width: "calc(100% - 500px)",
            borderRadius: "4px",
            fontSize: "16px",
            maxHeight: "calc(100vh - 120px)",
            overflow: "auto",
            scrollBehavior: "auto",
          }}
        >
          <Box style={{ position: "relative" }}>
            <Paper sx={{ pt: 1, pb: 1, opacity: 0.85 }}>
              <ControlPanel />
            </Paper>
          </Box>
        </div>
        <div
          style={{
            padding: "0px 0px 6px 12px",
            position: "absolute",
            zIndex: 9,
            bottom: 0,
            left: 0,
            fontSize: "16px",
            overflow: "auto",
            scrollBehavior: "auto",
            width: "100%",
          }}
        >
          <Box style={{ position: "relative" }}>
            <MapLegend />
          </Box>
        </div>

        <Map
          {...viewState}
          ref={mapRef}
          onLoad={() => {}}
          mapStyle={publicRuntimeConfig.MAPBOX_STYLE_URL!}
          mapboxAccessToken={MAPBOX_API_TOKEN}
          attributionControl={true}
          customAttribution={['<a href="https://www.cotrip.com/" target="_blank">© CDOT</a>']}
          styleDiffing
          style={{ width: "100%", height: "100%" }}
          onMove={(evt) => dispatch(setViewState(evt.viewState))}
          onClick={(e) => dispatch(onMapClick({ event: e, mapRef }))}
          // onMouseDown={this.onMouseDown}
          // onMouseUp={this.onMouseUp}
          interactiveLayerIds={allInteractiveLayerIds}
          cursor={cursor}
          onMouseMove={(e) => dispatch(onMapMouseMove(e))}
          onMouseEnter={(e) => dispatch(onMapMouseEnter(e))}
          onMouseLeave={(e) => dispatch(onMapMouseLeave(e))}
        >
          <Source
            type="geojson"
            data={connectingLanes && currentSignalGroups && addConnections(connectingLanes, currentSignalGroups)}
          >
            <Layer {...connectingLanesLayerStyle} />
          </Source>
          <Source
            type="geojson"
            data={
              connectingLanes && currentSignalGroups && sigGroupLabelsVisible
                ? addConnections(connectingLanes, currentSignalGroups)
                : undefined
            }
          >
            <Layer {...connectingLanesLabelsLayerStyle} />
          </Source>
          <Source type="geojson" data={currentBsms}>
            <Layer {...bsmLayerStyle} />
          </Source>
          <Source type="geojson" data={mapData?.mapFeatureCollection}>
            <Layer {...mapMessageLayerStyle} />
          </Source>
          <Source type="geojson" data={laneLabelsVisible ? mapData?.mapFeatureCollection : undefined}>
            <Layer {...mapMessageLabelsLayerStyle} />
          </Source>
          <Source type="geojson" data={connectingLanes && currentSignalGroups ? signalStateData : undefined}>
            <Layer {...signalStateLayerStyle} />
          </Source>
          <Source
            type="geojson"
            data={
              mapData && props.sourceData && props.sourceDataType == "notification"
                ? createMarkerForNotification(
                    [0, 0],
                    props.sourceData as MessageMonitor.Notification,
                    mapData.mapFeatureCollection
                  )
                : undefined
            }
          >
            <Layer {...markerLayerStyle} />
          </Source>
          {selectedFeature && (
            <CustomPopup selectedFeature={selectedFeature} onClose={() => dispatch(clearSelectedFeature())} />
          )}
          {showPopupOnHover && hoveredFeature && !selectedFeature && (
            <CustomPopup selectedFeature={hoveredFeature} onClose={() => dispatch(clearHoveredFeature())} />
          )}
        </Map>
        <SidePanel
          laneInfo={connectingLanes}
          signalGroups={currentSignalGroups}
          bsms={currentBsms}
          events={filteredSurroundingEvents}
          notifications={filteredSurroundingNotifications}
          sourceData={props.sourceData}
          sourceDataType={props.sourceDataType}
        />
      </Col>
    </Container>
  );
};

export default MapTab;
