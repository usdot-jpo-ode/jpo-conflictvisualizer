import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { group } from "console";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Rectangle,
  Tooltip,
  TooltipProps,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export const ConnectionOfTravelAssessmentCard = (props: { assessment: ConnectionOfTravelAssessment | undefined }) => {
  const { assessment } = props;

  function getWidthFactorFromData(data: any[] | undefined): number {
    if (!data) return 0.1;
    const maxFactor = 0.9;
    const numRowsForMax = 40;
    return 0.1 + Math.min(maxFactor, data.length / numRowsForMax);
  }
  const widthFactor = getWidthFactorFromData(assessment?.connectionOfTravelAssessmentGroups);

  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload) {
      const obj = payload[0].payload;
      return (
        <div
          key={obj.laneId}
          style={{
            padding: "6px",
            backgroundColor: "white",
            border: "1px solid grey",
          }}
        >
          <b>Connection ID: {obj.connectionID}</b>
          <p>Ingress Lane ID: {obj.ingressLaneID}</p>
          <p>EgressLaneID: {obj.egressLaneID}</p>
          <p>Event Count: {Math.max(obj.eventCountValid, obj.eventCountInvalid)}</p>
        </div>
      );
    }
    return null;
  };

  function sortByName(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  return (
    <Grid item width={assessment === undefined ? 200 : 80 + widthFactor * 1600}>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="overline">
                Connection of Travel Assessment
              </Typography>
              {assessment === undefined ? (
                <Typography color="textPrimary" variant="h5" key={""}>
                  No Data
                </Typography>
              ) : (
                <BarChart
                  width={widthFactor * 1600}
                  height={350}
                  data={assessment?.connectionOfTravelAssessmentGroups
                    .map((group) => {
                      return {
                        name: `${group.ingressLaneID}_${group.egressLaneID}`,
                        eventCountValid: group.connectionID == -1 ? 0 : group.eventCount,
                        eventCountInvalid: group.connectionID == -1 ? group.eventCount : 0,
                        connectionID: group.connectionID,
                        ingressLaneID: group.ingressLaneID,
                        egressLaneID: group.egressLaneID,
                      };
                    })
                    .sort(sortByName)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" label={{ value: "Connection ID", position: "insideBottomRight", offset: -5 }} />
                  <YAxis label={{ value: "Event Count", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={CustomTooltip} />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "10px",
                      height: "50px",
                    }}
                    payload={[
                      {
                        value: `Event Count Valid Connection ID`,
                        id: "eventCountValid",
                        color: "#463af1",
                      },
                      {
                        value: `Event Count Invalid Connection ID`,
                        id: "eventCountInvalid",
                        color: "#f35555",
                      },
                    ]}
                  />
                  <Bar dataKey="eventCountValid" stackId="a" fill="#463af1" />
                  <Bar dataKey="eventCountInvalid" stackId="a" fill="#f35555" />
                </BarChart>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
