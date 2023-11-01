import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { group } from "console";
import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Rectangle, Tooltip } from "recharts";

export const ConnectionOfTravelAssessmentCard = (props: {
  assessment: ConnectionOfTravelAssessment | undefined;
  grid: Boolean;
}) => {
  const [mockAssessment, setMockAssessment] = React.useState<ConnectionOfTravelAssessment>({
    assessmentGeneratedAt: 1,
    assessmentType: "type",
    intersectionID: -1,
    roadRegulatorID: -1,
    timestamp: 1,
    connectionOfTravelAssessmentGroups: [
      {
        connectionID: 1,
        ingressLaneID: 1,
        egressLaneID: 2,
        eventCount: 10,
      },
      {
        connectionID: 1,
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 10,
      },
    ],
  });
  const { assessment } = props;

  function getWidthFactorFromData(data: any[]): number {
    const maxFactor = 1;
    const numRowsForMax = 20;
    return Math.min(maxFactor, data.length/numRowsForMax)
  }
  const widthFactor = getWidthFactorFromData(mockAssessment.connectionOfTravelAssessmentGroups)

  return (
    <Grid item xs={widthFactor*12}>
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Button onClick={() => {
          setMockAssessment({...mockAssessment, connectionOfTravelAssessmentGroups: [...mockAssessment.connectionOfTravelAssessmentGroups, {
            connectionID: mockAssessment.connectionOfTravelAssessmentGroups.length,
            ingressLaneID: 1,
            egressLaneID: 3,
            eventCount: Math.random() * 50,
          },]})
        }}>
          <Typography color="textSecondary" gutterBottom variant="overline">Add Data</Typography>
        </Button>
        <Button onClick={() => {
          setMockAssessment({...mockAssessment, connectionOfTravelAssessmentGroups: [...mockAssessment.connectionOfTravelAssessmentGroups.slice(0, -1)]})
        }}>
          <Typography color="textSecondary" gutterBottom variant="overline">Remove Data</Typography>
        </Button>
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
              width={widthFactor*1200}
              height={300}
              data={mockAssessment.connectionOfTravelAssessmentGroups.map((group) => {
                return {
                  name: `${group.connectionID}`,
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
  </Grid>
  );
};
