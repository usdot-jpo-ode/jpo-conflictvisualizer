import React, { useState, useEffect, ChangeEvent } from "react";
import Slider from "@mui/material/Slider";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Box, Typography, TextField, Button, Checkbox, InputAdornment, Chip } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { styled, SxProps, Theme } from "@mui/material/styles";
import { format } from "date-fns";
import JSZip from "jszip";
import { getSelectedLayerPopupContent } from "./popup";
import { LayerProps } from "react-map-gl";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadMapData,
  handleImportedMapMessageData,
  onTimeQueryChanged,
  selectSliderTimeValue,
  setLaneLabelsVisible,
  setShowPopupOnHover,
  setSigGroupLabelsVisible,
  setSliderValue,
  toggleLiveDataActive,
} from "./map-slice";
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
import { selectAuthToken } from "../../slices/userSlice";
import { selectSignalStateLayerStyle, setSignalLayerLayout } from "./map-layer-style-slice";
import { getTimeRange } from "./utilities/map-utils";

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    //border: `1px solid ${theme.palette.divider}`,
    // '&:not(:last-child)': {
    //   borderBottom: 0,
    // },
    // '&:before': {
    //   display: 'none',
    // },
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.8rem" }} />} {...props} />
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

interface ControlPanelProps {
  sx: SxProps<Theme> | undefined;
  timeQueryParams: {
    startDate: Date;
    endDate: Date;
    eventDate: Date;
    timeWindowSeconds: number;
  };
  onTimeQueryChanged: (eventTime?: Date, timeBefore?: number, timeAfter?: number, timeWindowSeconds?: number) => void;
  handleImportedMessageData: (messageData: any) => void;
  sliderValue: number;
  setSlider: (event: Event, value: number | number[], activeThumb: number) => void;
  max: number;
  sliderTimeValue: {
    start: Date;
    end: Date;
  };
  mapSpatTimes: {
    mapTime: number;
    spatTime: number;
  };
  downloadAllData: () => void;
  signalStateLayer: any;
  setSignalStateLayer: React.Dispatch<React.SetStateAction<any>>;
  laneLabelsVisible: boolean;
  setLaneLabelsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  sigGroupLabelsVisible: boolean;
  setSigGroupLabelsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  showPopupOnHover: boolean;
  setShowPopupOnHover: React.Dispatch<React.SetStateAction<boolean>>;
  liveDataActive: boolean;
  setLiveDataActive: React.Dispatch<React.SetStateAction<boolean>>;
}

function ControlPanel() {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();

  const authToken = useSelector(selectAuthToken);

  const signalStateLayerStyle = useSelector(selectSignalStateLayerStyle);

  const layersVisible = useSelector(selectLayersVisible);
  const allInteractiveLayerIds = useSelector(selectAllInteractiveLayerIds);
  const queryParams = useSelector(selectQueryParams);
  const sourceData = useSelector(selectSourceData);
  const sourceDataType = useSelector(selectSourceDataType);
  const intersectionId = useSelector(selectIntersectionId);
  const roadRegulatorId = useSelector(selectRoadRegulatorId);
  const loadOnNull = useSelector(selectLoadOnNull);
  const mapData = useSelector(selectMapData);
  const bsmData = useSelector(selectBsmData);
  const mapSignalGroups = useSelector(selectMapSignalGroups);
  const signalStateData = useSelector(selectSignalStateData);
  const spatSignalGroups = useSelector(selectSpatSignalGroups);
  const currentSignalGroups = useSelector(selectCurrentSignalGroups);
  const currentBsms = useSelector(selectCurrentBsms);
  const connectingLanes = useSelector(selectConnectingLanes);
  const filteredSurroundingEvents = useSelector(selectFilteredSurroundingEvents);
  const surroundingNotifications = useSelector(selectSurroundingNotifications);
  const filteredSurroundingNotifications = useSelector(selectFilteredSurroundingNotifications);
  const viewState = useSelector(selectViewState);
  const timeWindowSeconds = useSelector(selectTimeWindowSeconds);
  const sliderValue = useSelector(selectSliderValue);
  const renderTimeInterval = useSelector(selectRenderTimeInterval);
  const hoveredFeature = useSelector(selectHoveredFeature);
  const selectedFeature = useSelector(selectSelectedFeature);
  const rawData = useSelector(selectRawData);
  const mapSpatTimes = useSelector(selectMapSpatTimes);
  const sigGroupLabelsVisible = useSelector(selectSigGroupLabelsVisible);
  const laneLabelsVisible = useSelector(selectLaneLabelsVisible);
  const showPopupOnHover = useSelector(selectShowPopupOnHover);
  const importedMessageData = useSelector(selectImportedMessageData);
  const cursor = useSelector(selectCursor);
  const loadInitialDataTimeoutId = useSelector(selectLoadInitialDataTimeoutId);
  // const wsClient = useSelector(selectWsClient);
  const liveDataActive = useSelector(selectLiveDataActive);
  const currentMapData = useSelector(selectCurrentMapData);
  const currentSpatData = useSelector(selectCurrentSpatData);
  const currentBsmData = useSelector(selectCurrentBsmData);
  const sliderTimeValue = useSelector(selectSliderTimeValue);

  const getQueryParams = ({
    startDate,
    endDate,
    eventDate,
    timeWindowSeconds,
  }: {
    startDate: Date;
    endDate: Date;
    eventDate: Date;
    timeWindowSeconds: number;
  }) => {
    return {
      eventTime: eventDate,
      timeBefore: Math.round((eventDate.getTime() - startDate.getTime()) / 1000),
      timeAfter: Math.round((endDate.getTime() - eventDate.getTime()) / 1000),
      timeWindowSeconds: timeWindowSeconds,
    };
  };

  const [shouldReRender, setShouldReRender] = useState(true);
  const [dateParams, setDateParams] = useState<{
    eventTime?: Date;
    timeBefore?: number;
    timeAfter?: number;
    timeWindowSeconds?: number;
  }>(getQueryParams({ ...queryParams, timeWindowSeconds }));

  useEffect(() => {
    const newDateParams = getQueryParams({ ...queryParams, timeWindowSeconds });
    if (
      newDateParams.eventTime.getTime() != dateParams.eventTime?.getTime() ||
      newDateParams.timeWindowSeconds != dateParams.timeWindowSeconds
    ) {
      setShouldReRender(false);
      setDateParams(newDateParams);
    }
  }, [{ ...queryParams, timeWindowSeconds }]);

  useEffect(() => {
    if (shouldReRender) {
      dispatch(onTimeQueryChanged(dateParams));
    } else {
      setShouldReRender(true);
    }
  }, [dateParams]);

  const getNumber = (value: string): number | undefined => {
    const num = parseInt(value);
    if (isNaN(num)) {
      return undefined;
    }
    return num;
  };

  const openMessageData = (files: FileList | null) => {
    if (files == null) return;
    const file = files[0];
    var jsZip = new JSZip();
    const messageData: {
      mapData: ProcessedMap[];
      bsmData: OdeBsmData[];
      spatData: ProcessedSpat[];
      notificationData: any;
    } = {
      mapData: [],
      bsmData: [],
      spatData: [],
      notificationData: undefined,
    };
    jsZip.loadAsync(file).then(async (zip) => {
      const zipObjects: { relativePath: string; zipEntry: JSZip.JSZipObject }[] = [];
      zip.forEach((relativePath, zipEntry) => zipObjects.push({ relativePath, zipEntry }));
      for (let i = 0; i < zipObjects.length; i++) {
        const { relativePath, zipEntry } = zipObjects[i];
        if (relativePath.endsWith("_MAP_data.json")) {
          const data = await zipEntry.async("string");
          messageData.mapData = JSON.parse(data);
        } else if (relativePath.endsWith("_BSM_data.json")) {
          const data = await zipEntry.async("string");
          messageData.bsmData = JSON.parse(data);
        } else if (relativePath.endsWith("_Notification_data.json")) {
          const data = await zipEntry.async("string");
          messageData.notificationData = JSON.parse(data);
        } else if (relativePath.endsWith("_SPAT_data.json")) {
          const data = await zipEntry.async("string");
          messageData.spatData = JSON.parse(data);
        }
      }
      dispatch(handleImportedMapMessageData(messageData));
    });
  };

  return (
    <div
      style={{
        padding: "10px 10px 10px 10px",
      }}
    >
      <Accordion disableGutters>
        <AccordionSummary>
          <Typography variant="h5">
            Time Query
            {liveDataActive && <Chip label="Live Data Active" className="blink_me" sx={{ ml: 1 }} color="success" />}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ mt: 1 }}>
              <TextField
                label="Time Before Event"
                name="timeRangeBefore"
                type="number"
                sx={{ mt: 1 }}
                onChange={(e) => {
                  setDateParams((prevState) => {
                    return { ...prevState, timeBefore: getNumber(e.target.value) };
                  });
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                value={dateParams.timeBefore}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ mt: 4 }}>
                <DateTimePicker
                  label="Event Date"
                  disabled={liveDataActive}
                  value={dayjs(dateParams.eventTime ?? new Date())}
                  onChange={(e) => {
                    setDateParams((prevState) => {
                      return { ...prevState, eventTime: e?.toDate() };
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <TextField
                // fullWidth
                label="Time After Event"
                name="timeRangeAfter"
                type="number"
                sx={{ mt: 1 }}
                onChange={(e) => {
                  setDateParams((prevState) => {
                    return { ...prevState, timeAfter: getNumber(e.target.value) };
                  });
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                value={dateParams.timeAfter}
              />
              <TextField
                // fullWidth
                label="Time Render Window"
                name="timeRangeAfter"
                type="number"
                sx={{ mt: 1 }}
                onChange={(e) => {
                  setDateParams((prevState) => {
                    return { ...prevState, timeWindowSeconds: getNumber(e.target.value) };
                  });
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                value={dateParams.timeWindowSeconds}
              />
            </Box>
            <Chip
              label={liveDataActive ? "Stop Live Data" : "Render Live Data"}
              sx={{ mt: 1 }}
              onClick={() => {
                dispatch(toggleLiveDataActive());
              }}
              color={liveDataActive ? "success" : "default"}
              variant={liveDataActive ? undefined : "outlined"}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters defaultExpanded={true}>
        <AccordionSummary>
          <Typography variant="h5">Message Times & Download</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            className="control-panel"
            style={{
              padding: "10px 30px 0px 20px",
            }}
          >
            <h4>
              Visualization Time: {format(sliderTimeValue.start, "MM/dd/yyyy HH:mm:ss")} -{" "}
              {format(sliderTimeValue.end, "MM/dd/yyyy HH:mm:ss")}
            </h4>
            <h4>
              MAP Message Time:{" "}
              {mapSpatTimes.mapTime == 0 ? "No Data" : format(mapSpatTimes.mapTime * 1000, "MM/dd/yyyy HH:mm:ss")}
            </h4>

            <h4>
              SPAT Message Time:{" "}
              {mapSpatTimes.spatTime == 0 ? "No Data" : format(mapSpatTimes.spatTime * 1000, "MM/dd/yyyy HH:mm:ss")}
            </h4>
            <Button sx={{ m: 1 }} variant="contained" onClick={() => dispatch(downloadMapData())}>
              Download All Message Data
            </Button>
            <h4>
              Upload Message Data:{" "}
              <label htmlFor="upload">
                <input
                  accept=".zip"
                  id="upload"
                  name="upload"
                  type="file"
                  multiple={false}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    openMessageData(e.target.files);
                  }}
                />
              </label>
            </h4>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters defaultExpanded={false}>
        <AccordionSummary>
          <Typography variant="h5">Visual Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            className="control-panel"
            style={{
              padding: "10px 30px 0px 20px",
            }}
          >
            <div>
              <h4 style={{ float: "left", marginTop: "10px" }}>Rotate Signal Head Icons With Map </h4>
              <Checkbox
                checked={signalStateLayerStyle?.layout?.["icon-rotation-alignment"] == "map"}
                onChange={(event) =>
                  dispatch(
                    setSignalLayerLayout({
                      ...signalStateLayerStyle.layout,
                      "icon-rotation-alignment": event.target.checked ? "map" : "viewport",
                      "icon-rotate": event.target.checked ? ["get", "orientation"] : 0,
                    })
                  )
                }
              />
            </div>
            <div>
              <h4 style={{ float: "left", marginTop: "10px" }}>Show Lane IDs </h4>
              <Checkbox
                checked={laneLabelsVisible}
                onChange={(event) => dispatch(setLaneLabelsVisible(event.target.checked))}
              />
            </div>
            <div>
              <h4 style={{ float: "left", marginTop: "10px" }}>Show Signal Group IDs </h4>
              <Checkbox
                checked={sigGroupLabelsVisible}
                onChange={(event) => dispatch(setSigGroupLabelsVisible(event.target.checked))}
              />
            </div>
            <div>
              <h4 style={{ float: "left", marginTop: "10px" }}>Show Popup on Hover </h4>
              <Checkbox
                checked={showPopupOnHover}
                onChange={(event) => dispatch(setShowPopupOnHover(event.target.checked))}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      <Slider
        sx={{ ml: 2, width: "calc(100% - 60px)" }}
        value={sliderValue}
        onChange={(event: Event, value: number | number[], activeThumb: number) => dispatch(setSliderValue(value))}
        min={0}
        max={getTimeRange(queryParams.startDate, queryParams.endDate)}
        valueLabelDisplay="auto"
        disableSwap
      />
    </div>
  );
}

export default ControlPanel;
