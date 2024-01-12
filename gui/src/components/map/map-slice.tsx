import { AnyAction, createAsyncThunk, createSlice, PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { selectAuthToken } from "../../slices/userSlice";
import { CompatClient } from "@stomp/stompjs";
import MessageMonitorApi from "../../apis/mm-api";
import EventsApi from "../../apis/events-api";
import NotificationApi from "../../apis/notification-api";
import toast from "react-hot-toast";
import { parseBsmToGeojson, parseMapSignalGroups, parseSpatSignalGroups } from "./utilities/message-utils";
import { generateColorDictionary, generateMapboxStyleExpression } from "./utilities/colors";
import { setBsmCircleColor, setBsmLegendColors } from "./map-layer-style-slice";
import { getTimeRange } from "./utilities/map-utils";

export type MAP_LAYERS =
  | "mapMessage"
  | "mapMessageLabels"
  | "connectingLanes"
  | "connectingLanesLabels"
  | "invalidLaneCollection"
  | "bsm"
  | "signalStates";

export type MAP_QUERY_PARAMS = {
  startDate: Date;
  endDate: Date;
  eventDate: Date;
  vehicleId?: string;
  intersectionId?: number;
  roadRegulatorId?: number;
};

export type IMPORTED_MAP_MESSAGE_DATA = {
  mapData: ProcessedMap[];
  bsmData: OdeBsmData[];
  spatData: ProcessedSpat[];
  notificationData: any;
};

type timestamp = {
  timestamp: number;
};

export type MAP_PROPS = {
  sourceData: MessageMonitor.Notification | MessageMonitor.Event | Assessment | timestamp | undefined;
  sourceDataType: "notification" | "event" | "assessment" | "timestamp" | undefined;
  intersectionId: number | undefined;
  roadRegulatorId: number | undefined;
  loadOnNull?: boolean;
};

const initialState = {
  layersVisible: {
    mapMessage: false,
    mapMessageLabels: false,
    connectingLanes: false,
    connectingLanesLabels: false,
    invalidLaneCollection: false,
    bsm: false,
    signalStates: false,
  } as Record<MAP_LAYERS, boolean>,
  allInteractiveLayerIds: ["mapMessage", "connectingLanes", "signalStates", "bsm"] as MAP_LAYERS[],
  queryParams: {
    startDate: new Date(Date.now() - 1000 * 60 * 1),
    endDate: new Date(Date.now() + 1000 * 60 * 1),
    eventDate: new Date(Date.now()),
    vehicleId: undefined,
    intersectionId: undefined,
    roadRegulatorId: undefined,
  },
  sourceData: undefined as MAP_PROPS["sourceData"] | undefined,
  sourceDataType: undefined as MAP_PROPS["sourceDataType"] | undefined,
  intersectionId: undefined as MAP_PROPS["intersectionId"] | undefined,
  roadRegulatorId: undefined as MAP_PROPS["roadRegulatorId"] | undefined,
  loadOnNull: undefined as MAP_PROPS["loadOnNull"] | undefined,
  mapData: undefined as ProcessedMap | undefined,
  mapSignalGroups: undefined as SignalStateFeatureCollection | undefined,
  signalStateData: undefined as ProcessedMap | undefined,
  spatSignalGroups: undefined as SpatSignalGroups | undefined,
  currentSignalGroups: undefined as SpatSignalGroup | undefined,
  currentBsms: {
    type: "FeatureCollection" as "FeatureCollection",
    features: [],
  } as BsmFeatureCollection,
  connectingLanes: undefined as ConnectingLanesFeatureCollection | undefined,
  bsmData: {
    type: "FeatureCollection" as "FeatureCollection",
    features: [],
  } as BsmFeatureCollection,
  surroundingEvents: [] as MessageMonitor.Event[],
  filteredSurroundingEvents: [] as MessageMonitor.Event[],
  surroundingNotifications: [] as MessageMonitor.Notification[],
  filteredSurroundingNotifications: [] as MessageMonitor.Notification[],
  viewState: {
    latitude: 39.587905,
    longitude: -105.0907089,
    zoom: 19,
  },
  timeWindowSeconds: 60,
  sliderValue: 0,
  renderTimeInterval: [0, 0],
  hoveredFeature: undefined as any,
  selectedFeature: undefined as any,
  rawData: {},
  mapSpatTimes: { mapTime: 0, spatTime: 0 },
  sigGroupLabelsVisible: false,
  laneLabelsVisible: false,
  showPopupOnHover: false,
  importedMessageData: undefined as IMPORTED_MAP_MESSAGE_DATA | undefined,
  cursor: "default",
  loadInitialDataTimeoutId: undefined as NodeJS.Timeout | undefined,
  wsClient: undefined as CompatClient | undefined,
  liveDataActive: false,
  currentMapData: [] as ProcessedMap[],
  currentSpatData: [] as ProcessedSpat[],
  currentBsmData: {
    type: "FeatureCollection",
    features: [],
  } as BsmFeatureCollection,
};

export const pullInitialData = createAsyncThunk(
  "map/pullInitialData",
  async (_, { getState, dispatch }) => {
    const currentState = getState() as RootState;
    const authToken = selectAuthToken(currentState)!;
    const importedMessageData = selectImportedMessageData(currentState);
    const queryParams = selectQueryParams(currentState);

    console.debug("Pulling Initial Data");
    let rawMap: ProcessedMap[] = [];
    let rawSpat: ProcessedSpat[] = [];
    let rawBsm: OdeBsmData[] = [];
    if (!importedMessageData) {
      // ######################### Retrieve MAP Data #########################
      const rawMapPromise = MessageMonitorApi.getMapMessages({
        token: authToken,
        intersectionId: queryParams.intersectionId!,
        roadRegulatorId: queryParams.roadRegulatorId!,
        //startTime: new Date(queryParams.startDate.getTime() - 1000 * 60 * 60 * 1),
        endTime: queryParams.endDate,
        latest: true,
      });
      toast.promise(rawMapPromise, {
        loading: `Loading MAP Data`,
        success: `Successfully got MAP Data`,
        error: `Failed to get MAP data. Please see console`,
      });
      rawMap = await rawMapPromise;

      // ######################### Retrieve SPAT Data #########################
      const rawSpatPromise = MessageMonitorApi.getSpatMessages({
        token: authToken,
        intersectionId: queryParams.intersectionId!,
        roadRegulatorId: queryParams.roadRegulatorId!,
        startTime: queryParams.startDate,
        endTime: queryParams.endDate,
      });
      toast.promise(rawSpatPromise, {
        loading: `Loading SPAT Data`,
        success: `Successfully got SPAT Data`,
        error: `Failed to get SPAT data. Please see console`,
      });
      rawSpat = (await rawSpatPromise).sort((a, b) => Number(a.odeReceivedAt) - Number(b.odeReceivedAt));

      dispatch(getSurroundingEvents());
      dispatch(getSurroundingNotifications());
    } else {
      rawMap = importedMessageData.mapData;
      rawSpat = importedMessageData.spatData.sort((a, b) => Number(a.odeReceivedAt) - Number(b.odeReceivedAt));
      rawBsm = importedMessageData.bsmData;
    }
    if (!rawMap || rawMap.length == 0) {
      console.info("NO MAP MESSAGES WITHIN TIME");
      // return;
    }

    const latestMapMessage: ProcessedMap = rawMap.at(-1)!;
    const mapCoordinates: OdePosition3D = latestMapMessage?.properties.refPoint;
    const mapSignalGroupsLocal = parseMapSignalGroups(latestMapMessage);
    const spatSignalGroupsLocal = parseSpatSignalGroups(rawSpat);

    // ######################### BSMs #########################
    if (!importedMessageData) {
      const rawBsmPromise = MessageMonitorApi.getBsmMessages({
        token: authToken,
        vehicleId: queryParams.vehicleId,
        startTime: queryParams.startDate,
        endTime: queryParams.endDate,
        long: mapCoordinates.longitude,
        lat: mapCoordinates.latitude,
        distance: 500,
      });
      toast.promise(rawBsmPromise, {
        loading: `Loading BSM Data`,
        success: `Successfully got BSM Data`,
        error: `Failed to get BSM data. Please see console`,
      });
      rawBsm = await rawBsmPromise;
    }
    let bsmGeojson = parseBsmToGeojson(rawBsm);
    bsmGeojson = {
      ...bsmGeojson,
      features: [...bsmGeojson.features.sort((a, b) => b.properties.odeReceivedAt - a.properties.odeReceivedAt)],
    };
    dispatch(renderEntireMap({ currentMapData: rawMap, currentSpatData: rawSpat, currentBsmData: bsmGeojson }));
    return {
      mapData: latestMapMessage,
      connectingLanes: latestMapMessage.connectingLanesFeatureCollection,
      spatSignalGroups: spatSignalGroupsLocal,
      mapSignalGroups: mapSignalGroupsLocal,
      mapTime: latestMapMessage.properties.odeReceivedAt as unknown as number,
    };
  },
  {
    condition: (_, { getState }) =>
      selectAuthToken(getState() as RootState) != undefined &&
      selectQueryParams(getState() as RootState).intersectionId != undefined &&
      selectQueryParams(getState() as RootState).roadRegulatorId != undefined &&
      (selectSourceData(getState() as RootState) != undefined || selectLoadOnNull(getState() as RootState) == true),
  }
);

export const renderEntireMap = createAsyncThunk(
  "map/renderEntireMap",
  async (
    args: { currentMapData: ProcessedMap[]; currentSpatData: ProcessedSpat[]; currentBsmData: BsmFeatureCollection },
    { getState, dispatch }
  ) => {
    const { currentMapData, currentSpatData, currentBsmData } = args;
    const currentState = getState() as RootState;
    const queryParams = selectQueryParams(currentState);
    const sourceData = selectSourceData(currentState);
    const sourceDataType = selectSourceDataType(currentState);

    // ######################### MAP Data #########################
    const latestMapMessage: ProcessedMap = currentMapData.at(-1)!;

    // ######################### SPAT Signal Groups #########################
    const mapSignalGroupsLocal = parseMapSignalGroups(latestMapMessage);

    const spatSignalGroupsLocal = parseSpatSignalGroups(currentSpatData);

    const uniqueIds = new Set(currentBsmData.features.map((bsm) => bsm.properties?.id));
    // generate equally spaced unique colors for each uniqueId
    const colors = generateColorDictionary(uniqueIds);
    dispatch(setBsmLegendColors(colors));
    // add color to each feature
    const bsmLayerStyle = generateMapboxStyleExpression(colors);
    dispatch(setBsmCircleColor(bsmLayerStyle));

    // ######################### Message Data #########################
    const rawData = {};
    rawData["map"] = currentMapData;
    rawData["spat"] = currentSpatData;
    rawData["bsm"] = currentBsmData;
    if (sourceDataType == "notification") {
      rawData["notification"] = sourceData;
    } else if (sourceDataType == "event") {
      rawData["event"] = sourceData;
    } else if (sourceDataType == "assessment") {
      rawData["assessment"] = sourceData;
    }
    return {
      connectingLanes: latestMapMessage.connectingLanesFeatureCollection,
      mapData: latestMapMessage,
      mapTime: latestMapMessage.properties.odeReceivedAt as unknown as number,
      mapSignalGroups: mapSignalGroupsLocal,
      spatSignalGroups: spatSignalGroupsLocal,
      bsmData: currentBsmData,
      rawData: rawData,
      sliderValue: Math.min(
        getTimeRange(queryParams.startDate, queryParams.eventDate ?? new Date()),
        getTimeRange(queryParams.startDate, queryParams.endDate)
      ),
    };
  },
  {
    condition: (
      args: { currentMapData: ProcessedMap[]; currentSpatData: ProcessedSpat[]; currentBsmData: BsmFeatureCollection },
      { getState }
    ) => args.currentMapData.length != 0,
  }
);

export const renderIterative_Map = createAsyncThunk(
  "map/renderIterative_Map",
  async (newMapData: ProcessedMap[], { getState, dispatch }) => {
    const currentState = getState() as RootState;
    const queryParams = selectQueryParams(currentState);
    const sourceData = selectSourceData(currentState);
    const sourceDataType = selectSourceDataType(currentState);
    const currentMapData: ProcessedMap[] = selectCurrentMapData(currentState);

    const start = Date.now();
    const OLDEST_DATA_TO_KEEP = queryParams.eventDate.getTime() - queryParams.startDate.getTime(); // milliseconds
    if (newMapData.length == 0) {
      console.warn("Did not attempt to render map (iterative MAP), no new MAP messages available:", newMapData);
      return currentMapData;
    }

    const currTimestamp = Date.parse(newMapData.at(-1)!.properties.odeReceivedAt);
    let oldIndex = 0;
    for (let i = 0; i < currentMapData.length; i++) {
      if ((currentMapData[i].properties.odeReceivedAt as unknown as number) < currTimestamp - OLDEST_DATA_TO_KEEP) {
        oldIndex = i;
      } else {
        break;
      }
    }
    const currentMapDataLocal = currentMapData.slice(oldIndex, currentMapData.length).concat(newMapData);

    // ######################### MAP Data #########################
    const latestMapMessage: ProcessedMap = currentMapDataLocal.at(-1)!;

    // ######################### SPAT Signal Groups #########################
    const mapSignalGroupsLocal = parseMapSignalGroups(latestMapMessage);
    console.log("MAP RENDER TIME:", Date.now() - start, "ms");
    return {
      currentMapData: currentMapDataLocal,
      connectingLanes: latestMapMessage.connectingLanesFeatureCollection,
      mapData: latestMapMessage,
      mapTime: currTimestamp,
      mapSignalGroups: mapSignalGroupsLocal,
    };
  },
  {
    condition: (newMapData: ProcessedSpat[], { getState }) => newMapData.length != 0,
  }
);

export const getSurroundingEvents = createAsyncThunk(
  "map/getSurroundingEvents",
  async (_, { getState }) => {
    const currentState = getState() as RootState;
    const authToken = selectAuthToken(currentState)!;
    const queryParams = selectQueryParams(currentState);

    const surroundingEventsPromise = EventsApi.getAllEvents(
      authToken,
      queryParams.intersectionId!,
      queryParams.roadRegulatorId!,
      queryParams.startDate,
      queryParams.endDate
    );
    toast.promise(surroundingEventsPromise, {
      loading: `Loading Event Data`,
      success: `Successfully got Event Data`,
      error: `Failed to get Event data. Please see console`,
    });
    return surroundingEventsPromise;
  },
  {
    condition: (_, { getState }) =>
      selectAuthToken(getState() as RootState) != undefined &&
      selectQueryParams(getState() as RootState).intersectionId != undefined &&
      selectQueryParams(getState() as RootState).roadRegulatorId != undefined,
  }
);

export const getSurroundingNotifications = createAsyncThunk(
  "map/getSurroundingNotifications",
  async (_, { getState }) => {
    const currentState = getState() as RootState;
    const authToken = selectAuthToken(currentState)!;
    const queryParams = selectQueryParams(currentState);

    const surroundingNotificationsPromise = NotificationApi.getAllNotifications({
      token: authToken,
      intersectionId: queryParams.intersectionId!,
      roadRegulatorId: queryParams.roadRegulatorId!,
      startTime: queryParams.startDate,
      endTime: queryParams.endDate,
    });
    toast.promise(surroundingNotificationsPromise, {
      loading: `Loading Notification Data`,
      success: `Successfully got Notification Data`,
      error: `Failed to get Notification data. Please see console`,
    });
    return surroundingNotificationsPromise;
  },
  {
    condition: (_, { getState }) =>
      selectAuthToken(getState() as RootState) != undefined &&
      selectQueryParams(getState() as RootState).intersectionId != undefined &&
      selectQueryParams(getState() as RootState).roadRegulatorId != undefined,
  }
);

export const mapSlice = createSlice({
  name: "map",
  initialState: {
    loading: false,
    requestOut: false,
    value: initialState,
  },
  reducers: {
    setSurroundingEvents: (state, action: PayloadAction<MessageMonitor.Event[]>) => {
      state.value.surroundingEvents = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSurroundingEvents.fulfilled, (state, action: PayloadAction<MessageMonitor.Event[]>) => {
        state.value.surroundingEvents = action.payload;
      })
      .addCase(getSurroundingNotifications.fulfilled, (state, action: PayloadAction<MessageMonitor.Notification[]>) => {
        state.value.surroundingNotifications = action.payload;
      })
      .addCase(
        pullInitialData.fulfilled,
        (
          state,
          action: PayloadAction<
            | {
                mapData: ProcessedMap;
                connectingLanes: ConnectingLanesFeatureCollection;
                spatSignalGroups: SpatSignalGroups;
                mapSignalGroups: SignalStateFeatureCollection;
                mapTime: number;
              }
            | undefined
          >
        ) => {
          if (!action.payload) return;
          state.value.mapData = action.payload.mapData;
          if (action.payload.mapData != null)
            state.value.viewState = {
              latitude: action.payload.mapData.properties.refPoint.latitude,
              longitude: action.payload.mapData.properties.refPoint.longitude,
              zoom: 19,
            };
          state.value.connectingLanes = action.payload.connectingLanes;
          state.value.spatSignalGroups = action.payload.spatSignalGroups;
          state.value.mapSignalGroups = action.payload.mapSignalGroups;
          state.value.mapSpatTimes = { ...state.value.mapSpatTimes, mapTime: action.payload.mapTime };
        }
      )
      .addCase(
        renderEntireMap.fulfilled,
        (
          state,
          action: PayloadAction<{
            mapData: ProcessedMap;
            connectingLanes: ConnectingLanesFeatureCollection;
            spatSignalGroups: SpatSignalGroups;
            mapSignalGroups: SignalStateFeatureCollection;
            mapTime: number;
            bsmData: BsmFeatureCollection;
            rawData: any;
            sliderValue: number;
          }>
        ) => {
          state.value.mapData = action.payload.mapData;
          if (action.payload.mapData != null)
            state.value.viewState = {
              latitude: action.payload.mapData.properties.refPoint.latitude,
              longitude: action.payload.mapData.properties.refPoint.longitude,
              zoom: 19,
            };
          state.value.connectingLanes = action.payload.connectingLanes;
          state.value.spatSignalGroups = action.payload.spatSignalGroups;
          state.value.mapSignalGroups = action.payload.mapSignalGroups;
          state.value.mapSpatTimes = { ...state.value.mapSpatTimes, mapTime: action.payload.mapTime };
          state.value.bsmData = action.payload.bsmData;
          state.value.rawData = action.payload.rawData;
          state.value.sliderValue = action.payload.sliderValue;
        }
      )
      .addCase(
        renderIterative_Map.fulfilled,
        (
          state,
          action: PayloadAction<
            | {
                currentMapData: ProcessedMap[];
                connectingLanes: ConnectingLanesFeatureCollection;
                mapData: ProcessedMap;
                mapTime: number;
                mapSignalGroups: SpatSignalGroups;
              }
            | unknown
          >
        ) => {
          if (!action.payload) return;
          state.value.currentMapData = action.payload.currentMapData;
          const previousMapMessage: ProcessedMap | undefined = action.payload.currentMapData.at(-1);
          if (
            state.value.mapData != null &&
            (state.value.mapData.properties.refPoint.latitude != previousMapMessage?.properties.refPoint.latitude ||
              state.value.mapData.properties.refPoint.longitude != previousMapMessage?.properties.refPoint.longitude)
          )
            state.value.viewState = {
              latitude: action.payload.mapData.properties.refPoint.latitude,
              longitude: action.payload.mapData.properties.refPoint.longitude,
              zoom: 19,
            };
          state.value.connectingLanes = action.payload.connectingLanes;
          state.value.mapData = action.payload.mapData;
          state.value.mapSignalGroups = action.payload.mapSignalGroups;
          state.value.mapSpatTimes = { ...state.value.mapSpatTimes, mapTime: action.payload.mapTime };
        }
      );
  },
});

export const selectLoading = (state: RootState) => state.map.loading;

export const selectLayersVisible = (state: RootState) => state.map.value.layersVisible;
export const selectAllInteractiveLayerIds = (state: RootState) => state.map.value.allInteractiveLayerIds;
export const selectQueryParams = (state: RootState) => state.map.value.queryParams;
export const selectSourceData = (state: RootState) => state.map.value.sourceData;
export const selectSourceDataType = (state: RootState) => state.map.value.sourceDataType;
export const selectIntersectionId = (state: RootState) => state.map.value.intersectionId;
export const selectRoadRegulatorId = (state: RootState) => state.map.value.roadRegulatorId;
export const selectLoadOnNull = (state: RootState) => state.map.value.loadOnNull;
export const selectMapData = (state: RootState) => state.map.value.mapData;
export const selectMapSignalGroups = (state: RootState) => state.map.value.mapSignalGroups;
export const selectSignalStateData = (state: RootState) => state.map.value.signalStateData;
export const selectSpatSignalGroups = (state: RootState) => state.map.value.spatSignalGroups;
export const selectCurrentSignalGroups = (state: RootState) => state.map.value.currentSignalGroups;
export const selectCurrentBsms = (state: RootState) => state.map.value.currentBsms;
export const selectConnectingLanes = (state: RootState) => state.map.value.connectingLanes;
export const selectFilteredSurroundingEvents = (state: RootState) => state.map.value.filteredSurroundingEvents;
export const selectSurroundingNotifications = (state: RootState) => state.map.value.surroundingNotifications;
export const selectFilteredSurroundingNotifications = (state: RootState) =>
  state.map.value.filteredSurroundingNotifications;
export const selectViewState = (state: RootState) => state.map.value.viewState;
export const selectTimeWindowSeconds = (state: RootState) => state.map.value.timeWindowSeconds;
export const selectSliderValue = (state: RootState) => state.map.value.sliderValue;
export const selectRenderTimeInterval = (state: RootState) => state.map.value.renderTimeInterval;
export const selectHoveredFeature = (state: RootState) => state.map.value.hoveredFeature;
export const selectSelectedFeature = (state: RootState) => state.map.value.selectedFeature;
export const selectRawData = (state: RootState) => state.map.value.rawData;
export const selectMapSpatTimes = (state: RootState) => state.map.value.mapSpatTimes;
export const selectSigGroupLabelsVisible = (state: RootState) => state.map.value.sigGroupLabelsVisible;
export const selectLaneLabelsVisible = (state: RootState) => state.map.value.laneLabelsVisible;
export const selectShowPopupOnHover = (state: RootState) => state.map.value.showPopupOnHover;
export const selectImportedMessageData = (state: RootState) => state.map.value.importedMessageData;
export const selectCursor = (state: RootState) => state.map.value.cursor;
export const selectLoadInitialDataTimeoutId = (state: RootState) => state.map.value.loadInitialDataTimeoutId;
export const selectWsClient = (state: RootState) => state.map.value.wsClient;
export const selectLiveDataActive = (state: RootState) => state.map.value.liveDataActive;
export const selectCurrentMapData = (state: RootState) => state.map.value.currentMapData;
export const selectCurrentSpatData = (state: RootState) => state.map.value.currentSpatData;
export const selectCurrentBsmData = (state: RootState) => state.map.value.currentBsmData;

export const {
  selectRsu,
  toggleMapDisplay,
  clearBsm,
  toggleSsmSrmDisplay,
  setSelectedSrm,
  toggleBsmPointSelect,
  updateBsmPoints,
  updateBsmDate,
  triggerBsmDateError,
  changeMessageType,
  setBsmFilter,
  setBsmFilterStep,
  setBsmFilterOffset,
  setLoading,
} = mapSlice.actions;

export default mapSlice.reducer;
