import {
  Paper,
  Box,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Divider,
} from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { styled } from "@mui/material/styles";

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

interface MapLegendPropsType {
  bsmColors: { [key: string]: string };
  laneColors: { [key: string]: string };
  travelConnectionColors: { [key: string]: string };
}

export const MapLegend = (props: MapLegendPropsType) => {
  const { bsmColors, laneColors, travelConnectionColors } = props;

  const bsmColorsList: JSX.Element[] = [];
  for (const [key, value] of Object.entries(bsmColors)) {
    bsmColorsList.push(
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 5,
            marginRight: 10,
            minWidth: 110,
          }}
        >
          <div>{key}: </div>
          <div style={{ height: 20, width: 20, backgroundColor: value, marginLeft: "auto" }}></div>
        </div>
        <p>|</p>
      </>
    );
  }

  const travelConnectionColorsList: JSX.Element[] = [];
  for (const [key, value] of Object.entries(travelConnectionColors)) {
    travelConnectionColorsList.push(
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 5,
            marginRight: 10,
            minWidth: 110,
          }}
        >
          <div>{key}: </div>
          <div style={{ height: 20, width: 20, backgroundColor: value, marginLeft: "auto" }}></div>
        </div>
        <p>|</p>
      </>
    );
    console.log(key, value);
  }

  const laneColorsList: JSX.Element[] = [];
  for (const [key, value] of Object.entries(laneColors)) {
    laneColorsList.push(
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 5,
            marginRight: 10,
            minWidth: 110,
          }}
        >
          <div>{key}: </div>
          <div style={{ height: 20, width: 20, backgroundColor: value, marginLeft: "auto" }}></div>
        </div>
        <p>|</p>
      </>
    );
    console.log(key, value);
  }

  return (
    <Accordion disableGutters defaultExpanded={true}>
      <AccordionSummary>
        <Typography variant="h5">Legend</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper className="legend" style={{ userSelect: "none" }}>
          {/* <Tooltip title="Latest data timestamp received">
            <div style={{ fontFamily: "Arial Narrow" }}>{this.state.timestampFormat}</div>
          </Tooltip> */}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 10, minWidth: 140 }}
            >
              <div>Lane Colors: </div>
            </div>
            {laneColorsList}
          </div>

          <Divider sx={{ borderRadius: 1 }} />

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 10, minWidth: 140 }}
            >
              <div>Travel Connections: </div>
            </div>
            {travelConnectionColorsList}
          </div>

          <Divider sx={{ borderRadius: 1 }} />

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 10, minWidth: 140 }}
            >
              <div>BSM Colors: </div>
            </div>
            {bsmColorsList}
          </div>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};
