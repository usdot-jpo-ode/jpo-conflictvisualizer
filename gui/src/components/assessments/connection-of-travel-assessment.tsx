import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { group } from "console";
import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Rectangle, Tooltip } from "recharts";

export const ConnectionOfTravelAssessmentCard = (props: { assessment: ConnectionOfTravelAssessment | undefined }) => {
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
        connectionID: 2,
        ingressLaneID: 1,
        egressLaneID: 3,
        eventCount: 12,
      },
    ],
  });
  const { assessment } = props;

  function getWidthFactorFromData(data: any[]): number {
    if (!data) return 0.1;
    const maxFactor = 0.9;
    const numRowsForMax = 40;
    return 0.1 + Math.min(maxFactor, data.length / numRowsForMax);
  }
  0;
  const widthFactor = getWidthFactorFromData(mockAssessment?.connectionOfTravelAssessmentGroups);

  return (
    <Grid item width={100 + widthFactor * 1200}>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Button
            onClick={() => {
              setMockAssessment({
                ...mockAssessment,
                connectionOfTravelAssessmentGroups: [
                  ...mockAssessment.connectionOfTravelAssessmentGroups,
                  {
                    connectionID: mockAssessment.connectionOfTravelAssessmentGroups.length,
                    ingressLaneID: 1,
                    egressLaneID: 3,
                    eventCount: Math.random() * 50,
                  },
                ],
              });
            }}
          >
            <Typography color="textSecondary" gutterBottom variant="overline">
              Add Data
            </Typography>
          </Button>
          <Button
            onClick={() => {
              setMockAssessment({
                ...mockAssessment,
                connectionOfTravelAssessmentGroups: [...mockAssessment.connectionOfTravelAssessmentGroups.slice(0, -1)],
              });
            }}
          >
            <Typography color="textSecondary" gutterBottom variant="overline">
              Remove Data
            </Typography>
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
                width={widthFactor * 1200}
                height={350}
                data={mockAssessment.connectionOfTravelAssessmentGroups.map((group) => {
                  return {
                    name: `${group.connectionID}`,
                    eventCount: group.eventCount,
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
                <XAxis dataKey="name" label={{ value: "Connection ID", position: "insideBottomRight", offset: -5 }} />
                <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    paddingTop: "10px",
                    height: "50px",
                  }}
                />
                <Bar dataKey="eventCount" fill="#2e1fff" />
              </BarChart>
              {/* )} */}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
