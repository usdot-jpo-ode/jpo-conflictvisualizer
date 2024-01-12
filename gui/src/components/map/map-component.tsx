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
  pullInitialData,
  renderIterative_Bsm,
  renderIterative_Map,
  renderIterative_Spat,
  selectAllInteractiveLayerIds,
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

  // mapLayerStyleSlice
  const mapMessageLayerStyle = useSelector(selectMapMessageLayerStyle);
  const mapMessageLabelsLayerStyle = useSelector(selectMapMessageLabelsLayerStyle);
  const connectingLanesLayerStyle = useSelector(selectConnectingLanesLayerStyle);
  const connectingLanesLabelsLayerStyle = useSelector(selectConnectingLanesLabelsLayerStyle);
  const markerLayerStyle = useSelector(selectMarkerLayerStyle);
  const bsmLayerStyle = useSelector(selectBsmLayerStyle);
  const signalStateLayerStyle = useSelector(selectSignalStateLayerStyle);
  const mapLegendColors = useSelector(selectMapLegendColors);

  const allInteractiveLayerIds = useSelector(selectAllInteractiveLayerIds);

  const mapRef = React.useRef<any>(null);

  const [queryParams, setQueryParams] = useState<{
    startDate: Date;
    endDate: Date;
    eventDate: Date;
    vehicleId?: string;
    intersectionId?: number;
    roadRegulatorId?: number;
  }>({
    ...generateQueryParams(props.sourceData, props.sourceDataType),
    intersectionId: props.intersectionId,
    roadRegulatorId: props.roadRegulatorId,
  });

  const [mapData, setMapData] = useState<ProcessedMap>();
  const [mapSignalGroups, setMapSignalGroups] = useState<SignalStateFeatureCollection>();
  const [signalStateData, setSignalStateData] = useState<SignalStateFeatureCollection>();
  const [spatSignalGroups, setSpatSignalGroups] = useState<SpatSignalGroups>();
  const [currentSignalGroups, setCurrentSignalGroups] = useState<SpatSignalGroup[]>();
  const [currentBsms, setCurrentBsms] = useState<BsmFeatureCollection>({
    type: "FeatureCollection" as "FeatureCollection",
    features: [],
  });
  const [connectingLanes, setConnectingLanes] = useState<ConnectingLanesFeatureCollection>();
  const [bsmData, setBsmData] = useState<BsmFeatureCollection>({
    type: "FeatureCollection" as "FeatureCollection",
    features: [],
  });
  const [surroundingEvents, setSurroundingEvents] = useState<MessageMonitor.Event[]>([]);
  const [filteredSurroundingEvents, setFilteredSurroundingEvents] = useState<MessageMonitor.Event[]>([]);
  const [surroundingNotifications, setSurroundingNotifications] = useState<MessageMonitor.Notification[]>([]);
  const [filteredSurroundingNotifications, setFilteredSurroundingNotifications] = useState<
    MessageMonitor.Notification[]
  >([]);
  //   const mapRef = useRef<mapboxgl.Map>();
  const [viewState, setViewState] = useState({
    latitude: 39.587905,
    longitude: -105.0907089,
    zoom: 19,
  });
  const [timeWindowSeconds, setTimeWindowSeconds] = useState<number>(60);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [renderTimeInterval, setRenderTimeInterval] = useState<number[]>([0, 0]);
  const [hoveredFeature, setHoveredFeature] = useState<any>(undefined);
  const [selectedFeature, setSelectedFeature] = useState<any>(undefined);
  const [rawData, setRawData] = useState({});
  const [mapSpatTimes, setMapSpatTimes] = useState({ mapTime: 0, spatTime: 0 });
  const [sigGroupLabelsVisible, setSigGroupLabelsVisible] = useState<boolean>(false);
  const [laneLabelsVisible, setLaneLabelsVisible] = useState<boolean>(false);
  const [showPopupOnHover, setShowPopupOnHover] = useState<boolean>(false);
  const [importedMessageData, setImportedMessageData] = useState<
    | {
        mapData: ProcessedMap[];
        bsmData: OdeBsmData[];
        spatData: ProcessedSpat[];
        notificationData: any;
      }
    | undefined
  >(undefined);
  const [cursor, setCursor] = useState<string>("default");

  const [loadInitialDataTimeoutId, setLoadInitialdataTimeoutId] = useState<NodeJS.Timeout | undefined>(undefined);
  const [wsClient, setWsClient] = useState<CompatClient | undefined>(undefined);

  const [liveDataActive, setLiveDataActive] = useState<boolean>(false);
  const [_, setCurrentMapData] = useState<ProcessedMap[]>([]);
  const [__, setCurrentSpatData] = useState<SpatSignalGroups>([]);
  const [___, setCurrentBsmData] = useState<BsmFeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
  const [____, setLastSliderUpdate] = useState<number | undefined>(undefined);

  useEffect(() => {
    console.debug("SELECTED FEATURE", selectedFeature);
  }, [selectedFeature]);

  const handleImportedMessageData = ({
    mapData,
    bsmData,
    spatData,
    notificationData,
  }: {
    mapData: ProcessedMap[];
    bsmData: OdeBsmData[];
    spatData: ProcessedSpat[];
    notificationData: any;
  }) => {
    const sortedSpatData = spatData.sort((x, y) => {
      if (x.odeReceivedAt < y.odeReceivedAt) {
        return 1;
      }
      if (x.odeReceivedAt > y.odeReceivedAt) {
        return -1;
      }
      return 0;
    });
    const endTime = new Date(sortedSpatData[0].odeReceivedAt);
    const startTime = new Date(sortedSpatData[sortedSpatData.length - 1].odeReceivedAt);
    setImportedMessageData({ mapData, bsmData, spatData, notificationData });
    setQueryParams({
      startDate: startTime,
      endDate: endTime,
      eventDate: startTime,
      intersectionId: mapData[0].properties.intersectionId,
      roadRegulatorId: -1,
    });
  };

  useEffect(() => {
    if (props.intersectionId != queryParams.intersectionId || props.roadRegulatorId != queryParams.roadRegulatorId) {
      const query_params = {
        ...queryParams,
        intersectionId: props.intersectionId,
        roadRegulatorId: props.roadRegulatorId,
      };
      setQueryParams(query_params);
      setTimeWindowSeconds(60);
    }
  }, [props.intersectionId, props.roadRegulatorId]);

  useEffect(() => {
    const newQueryParams = {
      ...generateQueryParams(props.sourceData, props.sourceDataType),
      intersectionId: props.intersectionId,
      roadRegulatorId: props.roadRegulatorId,
    };
    if (
      queryParams.startDate.getTime() != newQueryParams.startDate.getTime() ||
      queryParams.endDate.getTime() != newQueryParams.endDate.getTime() ||
      queryParams.eventDate.getTime() != newQueryParams.eventDate.getTime() ||
      queryParams.vehicleId != newQueryParams.vehicleId ||
      queryParams.intersectionId != newQueryParams.intersectionId ||
      queryParams.roadRegulatorId != newQueryParams.roadRegulatorId
    ) {
      setQueryParams(newQueryParams);
      setTimeWindowSeconds(60);
    }
  }, [props.sourceData]);

  useEffect(() => {
    if (liveDataActive) {
      return;
    }
    if (loadInitialDataTimeoutId) {
      clearTimeout(loadInitialDataTimeoutId);
    }
    setLoadInitialdataTimeoutId(setTimeout(() => dispatch(pullInitialData()), 500));
  }, [queryParams]);

  useEffect(() => {
    if (!mapSignalGroups || !spatSignalGroups) {
      console.debug("BSM Loading: No map or SPAT data", mapSignalGroups, spatSignalGroups);
      return;
    }

    // retrieve filtered SPATs
    let closestSignalGroup: { spat: SpatSignalGroup[]; datetime: number } | null = null;
    for (const datetime in spatSignalGroups) {
      const datetimeNum = Number(datetime) / 1000;
      if (datetimeNum >= renderTimeInterval[0] && datetimeNum <= renderTimeInterval[1]) {
        if (
          closestSignalGroup === null ||
          Math.abs(datetimeNum - renderTimeInterval[1]) < Math.abs(closestSignalGroup.datetime - renderTimeInterval[1])
        ) {
          closestSignalGroup = { datetime: datetimeNum, spat: spatSignalGroups[datetime] };
        }
      }
    }
    if (closestSignalGroup !== null) {
      setCurrentSignalGroups(closestSignalGroup.spat);
      setSignalStateData(generateSignalStateFeatureCollection(mapSignalGroups, closestSignalGroup.spat));
      setMapSpatTimes((prevValue) => ({ ...prevValue, spatTime: closestSignalGroup!.datetime }));
    } else {
      setCurrentSignalGroups(undefined);
      setSignalStateData(undefined);
    }

    // retrieve filtered BSMs
    const filteredBsms: BsmFeature[] = bsmData?.features?.filter(
      (feature) =>
        feature.properties?.odeReceivedAt >= renderTimeInterval[0] &&
        feature.properties?.odeReceivedAt <= renderTimeInterval[1]
    );
    setCurrentBsms({ ...bsmData, features: filteredBsms });

    const filteredEvents: MessageMonitor.Event[] = surroundingEvents.filter(
      (event) =>
        event.eventGeneratedAt / 1000 >= renderTimeInterval[0] && event.eventGeneratedAt / 1000 <= renderTimeInterval[1]
    );
    setFilteredSurroundingEvents(filteredEvents);

    const filteredNotifications: MessageMonitor.Notification[] = surroundingNotifications.filter(
      (notification) =>
        notification.notificationGeneratedAt / 1000 >= renderTimeInterval[0] &&
        notification.notificationGeneratedAt / 1000 <= renderTimeInterval[1]
    );
    setFilteredSurroundingNotifications(filteredNotifications);
  }, [bsmData, mapSignalGroups, renderTimeInterval, spatSignalGroups]);

  useEffect(() => {
    const startTime = queryParams.startDate.getTime() / 1000;

    const filteredStartTime = startTime + sliderValue - timeWindowSeconds;
    const filteredEndTime = startTime + sliderValue;

    setRenderTimeInterval([filteredStartTime, filteredEndTime]);
  }, [sliderValue, queryParams, timeWindowSeconds]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
    setLiveDataActive(false);
  };

  const maybeUpdateLiveSliderValue = () => {
    setLastSliderUpdate((prevLastSliderUpdate) => {
      if (liveDataActive && (!prevLastSliderUpdate || Date.now() - prevLastSliderUpdate > 1 * 1000)) {
        return updateLiveSliderValue();
      } else {
        return undefined;
      }
    });
  };

  useEffect(() => {
    if (liveDataActive) {
      if (authToken && props.roadRegulatorId && props.intersectionId) {
        initializeLiveStreaming(authToken, props.roadRegulatorId, props.intersectionId);
        onTimeQueryChanged(new Date(), 10, 0, 5);
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
      cleanUpLiveStreaming();
    }
  }, [liveDataActive]);

  const updateLiveSliderValue = () => {
    const newQueryParams = {
      startDate: new Date(Date.now() - (queryParams.endDate.getTime() - queryParams.startDate.getTime())),
      endDate: new Date(Date.now()),
      eventDate: new Date(Date.now()),
      vehicleId: undefined,
      intersectionId: queryParams.intersectionId,
      roadRegulatorId: queryParams.roadRegulatorId,
    };
    setQueryParams(newQueryParams);
    const sliderValue = getTimeRange(newQueryParams.startDate, newQueryParams.endDate);
    setSliderValue(sliderValue);
    return sliderValue;
  };

  const initializeLiveStreaming = (token: string, roadRegulatorId: number, intersectionId: number) => {
    // Connect to WebSocket when component mounts
    onTimeQueryChanged(new Date(), 10, 0, 2);

    let protocols = ["v10.stomp", "v11.stomp"];
    protocols.push(token);
    const url = `${publicRuntimeConfig.API_WS_URL}/stomp`;
    console.debug("Connecting to STOMP endpoint: " + url + " with token: " + token);

    // Stomp Client Documentation: https://stomp-js.github.io/stomp-websocket/codo/extra/docs-src/Usage.md.html
    let client = Stomp.client(url, protocols);
    client.debug = () => {};

    // Topics are in the format /live/{roadRegulatorID}/{intersectionID}/{spat,map,bsm}
    let spatTopic = `/live/${roadRegulatorId}/${intersectionId}/spat`;
    let mapTopic = `/live/${roadRegulatorId}/${intersectionId}/map`;
    let bsmTopic = `/live/${roadRegulatorId}/${intersectionId}/bsm`; // TODO: Filter by road regulator ID
    let spatTime = Date.now();
    let mapTime = Date.now();
    let bsmTime = Date.now();
    client.connect(
      {
        // "username": "test",
        // "password": "test",
        // Token: token,
      },
      () => {
        client.subscribe(spatTopic, function (mes: IMessage) {
          const spatMessage: ProcessedSpat = JSON.parse(mes.body);
          console.debug("Received SPaT message " + (Date.now() - spatTime) + " ms");
          spatTime = Date.now();
          dispatch(renderIterative_Spat([spatMessage]));
          maybeUpdateLiveSliderValue();
        });

        client.subscribe(mapTopic, function (mes: IMessage) {
          const mapMessage: ProcessedMap = JSON.parse(mes.body);
          console.debug("Received MAP message " + (Date.now() - mapTime) + " ms");
          mapTime = Date.now();
          dispatch(renderIterative_Map([mapMessage]));
          maybeUpdateLiveSliderValue();
        });

        client.subscribe(bsmTopic, function (mes: IMessage) {
          const bsmData: OdeBsmData = JSON.parse(mes.body);
          console.debug("Received BSM message " + (Date.now() - bsmTime) + " ms");
          bsmTime = Date.now();
          dispatch(renderIterative_Bsm([bsmData]));
          maybeUpdateLiveSliderValue();
        });
      },
      (error) => {
        console.error("ERROR connecting to live data Websockets", error);
      }
    );

    setWsClient(client);
  };

  const cleanUpLiveStreaming = () => {
    if (wsClient) {
      wsClient.disconnect(() => {
        console.debug("Disconnected from STOMP endpoint");
      });
    }
    setWsClient(undefined);
  };

  const onTimeQueryChanged = (
    eventTime: Date = new Date(),
    timeBefore?: number,
    timeAfter?: number,
    timeWindowSeconds?: number
  ) => {
    const updatedQueryParams = {
      startDate: new Date(eventTime.getTime() - (timeBefore ?? 0) * 1000),
      endDate: new Date(eventTime.getTime() + (timeAfter ?? 0) * 1000),
      eventDate: eventTime,
      intersectionId: queryParams.intersectionId,
      roadRegulatorId: queryParams.roadRegulatorId,
    };
    if (
      queryParams.startDate.getTime() != updatedQueryParams.startDate.getTime() ||
      queryParams.endDate.getTime() != updatedQueryParams.endDate.getTime() ||
      queryParams.eventDate.getTime() != updatedQueryParams.eventDate.getTime()
    ) {
      // Detected change in query params
      setQueryParams(updatedQueryParams);
    } else {
      // No change in query params
    }
    setTimeWindowSeconds((prevState) => timeWindowSeconds ?? prevState);
  };

  const onClickMap = (e) => {
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      //   layers: allInteractiveLayerIds,
    });
    const feature = features?.[0];
    if (feature && allInteractiveLayerIds.includes(feature.layer.id)) {
      setSelectedFeature({ clickedLocation: e.lngLat, feature });
    } else {
      setSelectedFeature(undefined);
    }
  };

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
              <ControlPanel
                sx={{ flex: 0 }}
                sliderValue={sliderValue}
                sliderTimeValue={{
                  start: new Date((queryParams.startDate.getTime() / 1000 + sliderValue - timeWindowSeconds) * 1000),
                  end: new Date((queryParams.startDate.getTime() / 1000 + sliderValue) * 1000),
                }}
                setSlider={handleSliderChange}
                downloadAllData={downloadAllData}
                timeQueryParams={{ ...queryParams, timeWindowSeconds }}
                onTimeQueryChanged={onTimeQueryChanged}
                mapSpatTimes={mapSpatTimes}
                max={getTimeRange(queryParams.startDate, queryParams.endDate)}
                signalStateLayer={signalStateLayer}
                setSignalStateLayer={setSignalStateLayer}
                laneLabelsVisible={laneLabelsVisible}
                setLaneLabelsVisible={setLaneLabelsVisible}
                sigGroupLabelsVisible={sigGroupLabelsVisible}
                setSigGroupLabelsVisible={setSigGroupLabelsVisible}
                handleImportedMessageData={handleImportedMessageData}
                showPopupOnHover={showPopupOnHover}
                setShowPopupOnHover={setShowPopupOnHover}
                liveDataActive={liveDataActive}
                setLiveDataActive={setLiveDataActive}
              />
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
            <MapLegend
              bsmColors={mapLegendColors.bsmColors}
              laneColors={mapLegendColors.laneColors}
              travelConnectionColors={mapLegendColors.travelConnectionColors}
              signalHeadIcons={mapLegendColors.signalHeadIcons}
            />
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
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={onClickMap}
          // onMouseDown={this.onMouseDown}
          // onMouseUp={this.onMouseUp}
          interactiveLayerIds={allInteractiveLayerIds}
          cursor={cursor}
          onMouseMove={(e: mapboxgl.MapLayerMouseEvent) => {
            const feature = e.features?.[0];
            if (feature && allInteractiveLayerIds.includes(feature.layer.id as MAP_LAYERS)) {
              setHoveredFeature({ clickedLocation: e.lngLat, feature });
            }
          }}
          onMouseEnter={(e: mapboxgl.MapLayerMouseEvent) => {
            setCursor("pointer");
            const feature = e.features?.[0];
            if (feature && allInteractiveLayerIds.includes(feature.layer.id as MAP_LAYERS)) {
              setHoveredFeature({ clickedLocation: e.lngLat, feature });
            } else {
              setHoveredFeature(undefined);
            }
          }}
          onMouseLeave={(e: mapboxgl.MapLayerMouseEvent) => {
            setCursor("");
            setHoveredFeature(undefined);
          }}
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
            <CustomPopup selectedFeature={selectedFeature} onClose={() => setSelectedFeature(undefined)} />
          )}
          {showPopupOnHover && hoveredFeature && !selectedFeature && (
            <CustomPopup selectedFeature={hoveredFeature} onClose={() => setHoveredFeature(undefined)} />
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
