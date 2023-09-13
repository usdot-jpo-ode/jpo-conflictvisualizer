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

interface MapLegendPropsType {
  bsmColors: { [key: string]: string };
  laneColors: { [key: string]: string };
}

export const MapLegend = (props: MapLegendPropsType) => {
  const { bsmColors, laneColors } = props;

  const bsmColorsList: JSX.Element[] = [];
  for (const [key, value] of Object.entries(bsmColors)) {
    bsmColorsList.push(
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 10 }}>
        <div>{key}: </div>
        <div style={{ height: 20, width: 20, backgroundColor: value, marginLeft: "3px" }}></div>
      </div>
    );
    console.log(key, value);
  }

  const laneColorsList: JSX.Element[] = [];
  for (const [key, value] of Object.entries(laneColors)) {
    laneColorsList.push(
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 10 }}>
        <div>{key}: </div>
        <div style={{ height: 20, width: 20, backgroundColor: value, marginLeft: "3px" }}></div>
      </div>
    );
    console.log(key, value);
  }

  return (
    <Paper className="legend" style={{ userSelect: "none" }}>
      {/* <Tooltip title="Latest data timestamp received">
            <div style={{ fontFamily: "Arial Narrow" }}>{this.state.timestampFormat}</div>
          </Tooltip> */}

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 10 }}>
          <div>BSM Colors: </div>
        </div>
        {bsmColorsList}
      </div>

      <Divider sx={{ borderRadius: 1 }} />

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: 10 }}>
          <div>Lane Colors: </div>
        </div>
        {laneColorsList}
      </div>
    </Paper>
  );
};
