import { Card, CardContent, Grid, Typography } from "@mui/material";
import { group } from "console";
import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Rectangle, Tooltip } from "recharts";

export const ConnectionOfTravelAssessmentCard = (props: {
  assessment: ConnectionOfTravelAssessment | undefined;
  small: Boolean;
}) => {
  const { assessment } = props;

  const mockAssessment = {
    connectionOfTravelAssessmentGroups: [
      {
        ingressLaneID: 1,
        egressLaneID: 2,
        eventCount: 10,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 10,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 4,
        eventCount: 2,
      },
      {
        ingressLaneID: 3,
        egressLaneID: 7,
        eventCount: 12,
      },
      {
        ingressLaneID: 7,
        egressLaneID: 2,
        eventCount: 50,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 37,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 37,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 37,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 37,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 37,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 37,
      },
      {
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 37,
      },
    ],
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Connection of Travel Assessment
            </Typography>
            {/* {assessment === undefined ? (
              <Typography color="textPrimary" variant="h5" key={""}>
                No Data
              </Typography>
            ) : ( */}
            <BarChart
              width={500}
              height={300}
              data={mockAssessment.connectionOfTravelAssessmentGroups.map((group) => {
                return {
                  name: `${group.ingressLaneID}_${group.egressLaneID}`,
                  uv: group.eventCount,
                };
              })}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* <Bar dataKey="pv" fill="#8884d8" /> */}
              <Bar dataKey="eventCount" fill="#82ca9d" />
            </BarChart>
            {/* )} */}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
