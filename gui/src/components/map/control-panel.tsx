import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
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
import { format, set } from "date-fns";
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
  selectBsmEventsByMinute,
  selectBsmEventsByMinute,
  selectBsmTrailLength,
  selectPlaybackModeActive,
  selectSliderTimeValue,
  setBsmTrailLength,
  setLaneLabelsVisible,
  setShowPopupOnHover,
  setSigGroupLabelsVisible,
  setSliderValue,
  toggleLiveDataActive,
  togglePlaybackModeActive,
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
import ScrollBar from "react-perfect-scrollbar";
import pauseIcon from "../../../public/pause.png";
import playIcon from "../../../public/play.png";

import { BarChart, XAxis, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
  const bsmTrailLength = useSelector(selectBsmTrailLength);

  const bsmEventsByMinute = useSelector(selectBsmEventsByMinute);
  const playbackModeActive = useSelector(selectPlaybackModeActive);

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

  const [shouldReRenderEventTime, setShouldReRenderEventTime] = useState(true);
  const [shouldReRenderTimeBefore, setShouldReRenderTimeBefore] = useState(true);
  const [shouldReRenderTimeAfter, setShouldReRenderTimeAfter] = useState(true);
  const [shouldReRenderTimeWindowSeconds, setShouldReRenderTimeWindowSeconds] = useState(true);
  const [shouldReRenderBsmTrail, setShouldReRenderBsmTrail] = useState(true);
  const [bsmTrailLengthLocal, setBsmTrailLengthLocal] = useState<string | undefined>(bsmTrailLength.toString());
  const [prevBsmTrailLength, setPrevBsmTrailLength] = useState<number>(bsmTrailLength);
  const [oldDateParams, setOldDateParams] = useState(getQueryParams({ ...queryParams, timeWindowSeconds }));
  const [eventTime, setEventTime] = useState<dayjs.Dayjs | null>(
    dayjs(getQueryParams({ ...queryParams, timeWindowSeconds }).eventTime.toString())
  );
  const [timeBefore, setTimeBefore] = useState<string | undefined>(
    getQueryParams({ ...queryParams, timeWindowSeconds }).timeBefore.toString()
  );
  const [timeAfter, setTimeAfter] = useState<string | undefined>(
    getQueryParams({ ...queryParams, timeWindowSeconds }).timeAfter.toString()
  );
  const [timeWindowSecondsLocal, setTimeWindowSeconds] = useState<string | undefined>(
    getQueryParams({ ...queryParams, timeWindowSeconds }).timeWindowSeconds.toString()
  );

  useEffect(() => {
    const newDateParams = getQueryParams({ ...queryParams, timeWindowSeconds });
    if (newDateParams.eventTime.getTime() != oldDateParams.eventTime.getTime()) {
      setShouldReRenderEventTime(false);
      setEventTime(dayjs(newDateParams.eventTime));
    }
    if (newDateParams.timeBefore != oldDateParams.timeBefore) {
      setShouldReRenderTimeBefore(false);
      setTimeBefore(newDateParams.timeBefore.toString());
    }
    if (newDateParams.timeAfter != oldDateParams.timeAfter) {
      setShouldReRenderTimeAfter(false);
      setTimeAfter(newDateParams.timeAfter.toString());
    }
    if (newDateParams.timeWindowSeconds != oldDateParams.timeWindowSeconds) {
      setShouldReRenderTimeWindowSeconds(false);
      setTimeWindowSeconds(newDateParams.timeWindowSeconds.toString());
    }
  }, [{ ...queryParams, timeWindowSeconds }]);

  useEffect(() => {
    if (bsmTrailLength != prevBsmTrailLength) {
      setShouldReRenderTimeAfter(false);
      setPrevBsmTrailLength(bsmTrailLength);
      setBsmTrailLengthLocal(bsmTrailLength.toString());
    }
  }, [bsmTrailLength]);

  useEffect(() => {
    if (shouldReRenderEventTime && isFormValid()) {
      setOldDateParams({
        eventTime: eventTime!.toDate(),
        timeBefore: getNumber(timeBefore)!,
        timeAfter: getNumber(timeAfter)!,
        timeWindowSeconds: getNumber(timeWindowSecondsLocal)!,
      });
      dispatch(
        onTimeQueryChanged({
          eventTime: eventTime!.toDate(),
          timeBefore: getNumber(timeBefore),
          timeAfter: getNumber(timeAfter),
          timeWindowSeconds: getNumber(timeWindowSecondsLocal),
        })
      );
    } else {
      setShouldReRenderEventTime(true);
    }
  }, [eventTime]);

  useEffect(() => {
    if (shouldReRenderTimeBefore && isFormValid()) {
      setOldDateParams({
        eventTime: eventTime!.toDate(),
        timeBefore: getNumber(timeBefore)!,
        timeAfter: getNumber(timeAfter)!,
        timeWindowSeconds: getNumber(timeWindowSecondsLocal)!,
      });
      dispatch(
        onTimeQueryChanged({
          eventTime: eventTime!.toDate(),
          timeBefore: getNumber(timeBefore),
          timeAfter: getNumber(timeAfter),
          timeWindowSeconds: getNumber(timeWindowSecondsLocal),
        })
      );
    } else {
      setShouldReRenderTimeBefore(true);
    }
  }, [timeBefore]);

  useEffect(() => {
    if (shouldReRenderTimeAfter && isFormValid()) {
      setOldDateParams({
        eventTime: eventTime!.toDate(),
        timeBefore: getNumber(timeBefore)!,
        timeAfter: getNumber(timeAfter)!,
        timeWindowSeconds: getNumber(timeWindowSecondsLocal)!,
      });
      dispatch(
        onTimeQueryChanged({
          eventTime: eventTime!.toDate(),
          timeBefore: getNumber(timeBefore),
          timeAfter: getNumber(timeAfter),
          timeWindowSeconds: getNumber(timeWindowSecondsLocal),
        })
      );
    } else {
      setShouldReRenderTimeAfter(true);
    }
  }, [timeAfter]);

  useEffect(() => {
    if (shouldReRenderTimeWindowSeconds && isFormValid()) {
      setOldDateParams({
        eventTime: eventTime!.toDate(),
        timeBefore: getNumber(timeBefore)!,
        timeAfter: getNumber(timeAfter)!,
        timeWindowSeconds: getNumber(timeWindowSecondsLocal)!,
      });
      dispatch(
        onTimeQueryChanged({
          eventTime: eventTime!.toDate(),
          timeBefore: getNumber(timeBefore),
          timeAfter: getNumber(timeAfter),
          timeWindowSeconds: getNumber(timeWindowSecondsLocal),
        })
      );
    } else {
      setShouldReRenderTimeWindowSeconds(true);
    }
  }, [timeWindowSeconds]);

  useEffect(() => {
    if (shouldReRenderBsmTrail && getNumber(bsmTrailLengthLocal) != null) {
      dispatch(setBsmTrailLength(getNumber(bsmTrailLengthLocal)!));
    } else {
      setShouldReRenderBsmTrail(true);
    }
  }, [bsmTrailLengthLocal]);

  const isFormValid = () => {
    try {
      const d = eventTime?.toDate().getTime()!;
      return (
        !isNaN(d) &&
        getNumber(timeBefore) != null &&
        getNumber(timeAfter) != null &&
        getNumber(timeWindowSecondsLocal) != null
      );
    } catch (e) {
      return false;
    }
  };

  const getNumber = (value: string | undefined): number | undefined => {
    if (value == null) return undefined;
    const num = parseInt(value);
    if (isNaN(num)) {
      return undefined;
    }
    return num;
  };

  const timelineTicks = [120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320];

  const formatMinutesAfterMidnightTime = useMemo(() => {
    return (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
    };
  }, []);

  const TimelineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            position: "relative",
            bottom: "15px",
          }}
        >
          <p className="label" style={{ color: "#333" }}>{`Time: ${payload[0].payload.timestamp}`}</p>
          <p className="intro" style={{ color: "#333" }}>{`Events: ${payload[0].payload.count}`}</p>
        </div>
      );
    }
    return null;
  };

  interface TimelineCursorProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }

  const TimelineCursor: React.FC<TimelineCursorProps> = ({ x = 0, y = 0, width = 0, height = 0 }) => {
    return (
      <rect
        x={x + width / 2 - 6}
        y={y - 1}
        width={12}
        height={height + 3}
        fill={bsmEventsByMinute != null && bsmEventsByMinute.length > 0 ? "#10B981" : "transparent"}
        style={{ pointerEvents: "none" }}
      />
    );
  };

  interface TimelineAxisTickProps {
    x?: number;
    y?: number;
    payload?: {
      value: any;
    };
  }

  const TimelineAxisTick: React.FC<TimelineAxisTickProps> = ({ x = 0, y = 0, payload }) => {
    const timeString = formatMinutesAfterMidnightTime(payload?.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={10} textAnchor="middle">
          {timeString}
        </text>
      </g>
    );
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
          // } else if (relativePath.endsWith("_Notification_data.json")) {
          //   const data = await zipEntry.async("string");
          //   messageData.notificationData = JSON.parse(data);
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
                  setTimeBefore(e.target.value);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                value={timeBefore}
              />
              <div style={{ marginTop: "9px", display: "inline-flex" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Event Date"
                    disabled={liveDataActive}
                    value={dayjs(eventTime ?? new Date())}
                    onChange={(e) => {
                      setEventTime(e);
                      //?.toDate()!
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <TextField
                // fullWidth
                label="Time After Event"
                name="timeRangeAfter"
                type="number"
                sx={{ mt: 1 }}
                onChange={(e) => {
                  setTimeAfter(e.target.value);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                value={timeAfter}
              />
              <TextField
                // fullWidth
                label="Time Render Window"
                name="timeRangeAfter"
                type="number"
                sx={{ mt: 1 }}
                onChange={(e) => {
                  if (e.target.value === "" || Number.isInteger(Number(e.target.value))) {
                    setTimeWindowSeconds(e.target.value);
                  }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                value={timeWindowSeconds}
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
            <h4>Activity Chart for {format(sliderTimeValue.start, "MM/dd/yyyy")}:</h4>

            <ResponsiveContainer width="100%" height={80}>
              <BarChart
                data={bsmEventsByMinute}
                barGap={0}
                barCategoryGap={0}
                onClick={(data) => {
                  if (data !== null && data.activePayload !== undefined && data.activePayload !== null) {
                    setEventTime(dayjs(data.activePayload[0].payload.minute));
                  }
                }}
              >
                <XAxis
                  dataKey="minutesAfterMidnight"
                  type="number"
                  domain={[0, 1440]}
                  tick={<TimelineAxisTick />}
                  ticks={timelineTicks}
                />
                <Bar dataKey="count" fill="#D14343" barSize={10} minPointSize={10}></Bar>
                <Tooltip
                  cursor={<TimelineCursor />}
                  content={({ active, payload, label }) => (
                    <TimelineTooltip active={active} payload={payload} label={label} />
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
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
        <AccordionDetails sx={{ overflowY: "auto" }}>
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
            <div>
              <TextField
                label="BSM Trail length"
                name="bsmTrailLength"
                type="number"
                sx={{ mt: 1 }}
                onChange={(e) => {
                  setBsmTrailLengthLocal(e.target.value);
                }}
                value={bsmTrailLengthLocal}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
        <button
          style={{ marginLeft: "1rem", border: "none", background: "none" }}
          onClick={() => dispatch(togglePlaybackModeActive())}
        >
          {playbackModeActive ? <img src={pauseIcon.src} alt="Pause" /> : <img src={playIcon.src} alt="Play" />}
        </button>
        <Slider
          sx={{ ml: 2, width: "calc(100% - 80px)" }}
          value={sliderValue}
          onChange={(event: Event, value: number | number[], activeThumb: number) => dispatch(setSliderValue(value))}
          min={0}
          max={getTimeRange(queryParams.startDate, queryParams.endDate)}
          valueLabelDisplay="auto"
          disableSwap
        />
      </div>
    </div>
  );
}

export default ControlPanel;
