import React, { useState, useEffect, ChangeEvent } from "react";
import Slider from "@mui/material/Slider";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Theme,
  FormControl,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  InputAdornment,
  Container,
} from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { styled, SxProps } from "@mui/material/styles";
import { format } from "date-fns";
import JSZip from "jszip";
import { getSelectedLayerPopupContent } from "./popup";
import { LayerProps } from "react-map-gl";

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
  setSignalStateLayer: (signalStateLayer: any) => void;
  laneLabelsVisible: boolean;
  setLaneLabelsVisible: (laneLabelsVisible: boolean) => void;
  sigGroupLabelsVisible: boolean;
  setSigGroupLabelsVisible: (sigGroupLabelsVisible: boolean) => void;
  showPopupOnHover: boolean;
  setShowPopupOnHover: (showPopupOnHover: boolean) => void;
}

function ControlPanel(props: ControlPanelProps) {
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

  const [dateParams, setDateParams] = useState<{
    eventTime?: Date;
    timeBefore?: number;
    timeAfter?: number;
    timeWindowSeconds?: number;
  }>(getQueryParams(props.timeQueryParams));

  useEffect(() => {
    const newDateParams = getQueryParams(props.timeQueryParams);
    if (newDateParams.eventTime != dateParams.eventTime) setDateParams(newDateParams);
  }, [props.timeQueryParams]);

  useEffect(() => {
    props.onTimeQueryChanged(
      dateParams.eventTime,
      dateParams.timeBefore,
      dateParams.timeAfter,
      dateParams.timeWindowSeconds
    );
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
        console.log(relativePath);
        if (relativePath.endsWith("_MAP_data.json")) {
          const data = await zipEntry.async("string");
          messageData.mapData = JSON.parse(data);
          console.log("AddedMAPData", messageData.mapData.length);
        } else if (relativePath.endsWith("_BSM_data.json")) {
          const data = await zipEntry.async("string");
          messageData.bsmData = JSON.parse(data);
          console.log("AddedBSMData", messageData.bsmData.length);
        } else if (relativePath.endsWith("_Notification_data.json")) {
          const data = await zipEntry.async("string");
          messageData.notificationData = JSON.parse(data);
          console.log("AddedNotificationData", messageData.notificationData.length);
        } else if (relativePath.endsWith("_SPAT_data.json")) {
          const data = await zipEntry.async("string");
          messageData.spatData = JSON.parse(data);
          console.log("AddedSPATData", messageData.spatData.length);
        }
      }
      console.log("Sending Message Data", messageData);
      props.handleImportedMessageData(messageData);
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
          <Typography variant="h5">Time Query</Typography>
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
              <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ mt: 2 }}>
                <DateTimePicker
                  label="Event Date"
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
              Visualization Time: {format(props.sliderTimeValue.start, "MM/dd/yyyy HH:mm:ss")} -{" "}
              {format(props.sliderTimeValue.end, "MM/dd/yyyy HH:mm:ss")}
            </h4>
            <h4>
              MAP Message Time:{" "}
              {props.mapSpatTimes.mapTime == 0
                ? "No Data"
                : format(props.mapSpatTimes.mapTime * 1000, "MM/dd/yyyy HH:mm:ss")}
            </h4>

            <h4>
              SPAT Message Time:{" "}
              {props.mapSpatTimes.spatTime == 0
                ? "No Data"
                : format(props.mapSpatTimes.spatTime * 1000, "MM/dd/yyyy HH:mm:ss")}
            </h4>
            <Button sx={{ m: 1 }} variant="contained" onClick={props.downloadAllData}>
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
                    console.log("Input Changed", e.target.files);
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
                checked={props.signalStateLayer.layout["icon-rotation-alignment"] == "map"}
                onChange={(event) =>
                  props.setSignalStateLayer({
                    ...props.signalStateLayer,
                    layout: {
                      ...props.signalStateLayer.layout,
                      "icon-rotation-alignment": event.target.checked ? "map" : "viewport",
                      "icon-rotate": event.target.checked ? ["get", "orientation"] : 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <h4 style={{ float: "left", marginTop: "10px" }}>Show Lane IDs </h4>
              <Checkbox
                checked={props.laneLabelsVisible}
                onChange={(event) => props.setLaneLabelsVisible(event.target.checked)}
              />
            </div>
            <div>
              <h4 style={{ float: "left", marginTop: "10px" }}>Show Signal Group IDs </h4>
              <Checkbox
                checked={props.sigGroupLabelsVisible}
                onChange={(event) => props.setSigGroupLabelsVisible(event.target.checked)}
              />
            </div>
            <div>
              <h4 style={{ float: "left", marginTop: "10px" }}>Show Popup on Hover </h4>
              <Checkbox
                checked={props.showPopupOnHover}
                onChange={(event) => props.setShowPopupOnHover(event.target.checked)}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      <Slider
        sx={{ ml: 2, width: "calc(100% - 60px)" }}
        value={props.sliderValue}
        onChange={props.setSlider}
        min={0}
        max={props.max}
        valueLabelDisplay="auto"
        disableSwap
      />
    </div>
  );
}

export default ControlPanel;
