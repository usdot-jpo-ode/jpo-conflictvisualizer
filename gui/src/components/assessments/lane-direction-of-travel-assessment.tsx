import { Card, CardContent, Grid, Tooltip, Typography } from "@mui/material";
import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts";

export const LaneDirectionOfTravelAssessmentCard = (props: {
  assessment: LaneDirectionOfTravelAssessment | undefined;
}) => {
  const { assessment } = props;

  const mockAssessment = {
    laneDirectionOfTravelAssessmentGroup: [
      {
        segmentID: 1,
        laneID: 1,
        inToleranceEvents: 10,
        outOfToleranceEvents: 10,
      },
      {
        segmentID: 1,
        laneID: 2,
        inToleranceEvents: 5,
        outOfToleranceEvents: 25,
      },
      {
        segmentID: 1,
        laneID: 3,
        inToleranceEvents: 55,
        outOfToleranceEvents: 12,
      },
      {
        segmentID: 2,
        laneID: 2,
        inToleranceEvents: 12,
        outOfToleranceEvents: 23,
      },
      {
        segmentID: 1,
        laneID: 3,
        inToleranceEvents: 0,
        outOfToleranceEvents: 15,
      },
    ],
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Lane Direction of Travel Assessment
            </Typography>
            {assessment === undefined ? (
              <Typography color="textPrimary" variant="h5" key={""}>
                No Data
              </Typography>
            ) : (
              <BarChart
                width={500}
                height={300}
                data={mockAssessment.laneDirectionOfTravelAssessmentGroup.map((group) => {
                  return {
                    name: `${group.segmentID}_${group.laneID}`,
                    uv: group.inToleranceEvents,
                    pv: group.outOfToleranceEvents,
                  };
                })}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                {/* <Tooltip /> */}
                <Legend />
                <Bar dataKey="pv" stackId="a" fill="#8884d8" />
                <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
              </BarChart>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
