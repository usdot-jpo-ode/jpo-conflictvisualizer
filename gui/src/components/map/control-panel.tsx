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

  const [shouldReRender, setShouldReRender] = useState(true);
  const [dateParams, setDateParams] = useState<{
    eventTime?: Date;
    timeBefore?: number;
    timeAfter?: number;
    timeWindowSeconds?: number;
  }>(getQueryParams(props.timeQueryParams));

  useEffect(() => {
    const newDateParams = getQueryParams(props.timeQueryParams);
    if (
      newDateParams.eventTime.getTime() != dateParams.eventTime?.getTime() ||
      newDateParams.timeWindowSeconds != dateParams.timeWindowSeconds
    ) {
      setShouldReRender(false);
      setDateParams(newDateParams);
    }
  }, [props.timeQueryParams]);

  useEffect(() => {
    if (shouldReRender) {
      props.onTimeQueryChanged(
        dateParams.eventTime,
        dateParams.timeBefore,
        dateParams.timeAfter,
        dateParams.timeWindowSeconds
      );
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
          <Typography variant="h5">
            Time Query
            {props.liveDataActive && (
              <Chip label="Live Data Active" className="blink_me" sx={{ ml: 1 }} color="success" />
            )}
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
                  disabled={props.liveDataActive}
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
              label={props.liveDataActive ? "Stop Live Data" : "Render Live Data"}
              sx={{ mt: 1 }}
              onClick={() => {
                props.setLiveDataActive((prevValue) => !prevValue);
              }}
              color={props.liveDataActive ? "success" : "default"}
              variant={props.liveDataActive ? undefined : "outlined"}
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
