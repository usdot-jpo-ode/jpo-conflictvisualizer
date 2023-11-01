import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from "recharts";

export const SignalStateEventAssessmentCard = (props: { assessment: SignalStateEventAssessment | undefined }) => {
  const { assessment } = props;

  const mockAssessment = {
    signalStateEventAssessmentGroup: [
      {
        signalGroup: 1,
        redEvents: 10,
        yellowEvents: 10,
        greenEvents: 10,
        darkEvents: 10,
      },
      {
        signalGroup: 2,
        redEvents: 5,
        yellowEvents: 15,
        greenEvents: 0,
        darkEvents: 20,
      },
      {
        signalGroup: 3,
        redEvents: 15,
        yellowEvents: 15,
        greenEvents: 0,
        darkEvents: 0,
      },
      {
        signalGroup: 4,
        redEvents: 1,
        yellowEvents: 1,
        greenEvents: 23,
        darkEvents: 2,
      },
      {
        signalGroup: 5,
        redEvents: 12,
        yellowEvents: 14,
        greenEvents: 16,
        darkEvents: 10,
      },
      {
        signalGroup: 5,
        redEvents: 12,
        yellowEvents: 14,
        greenEvents: 16,
        darkEvents: 10,
      },
      {
        signalGroup: 5,
        redEvents: 12,
        yellowEvents: 14,
        greenEvents: 16,
        darkEvents: 10,
      },
      {
        signalGroup: 5,
        redEvents: 12,
        yellowEvents: 14,
        greenEvents: 16,
        darkEvents: 10,
      },
      {
        signalGroup: 5,
        redEvents: 12,
        yellowEvents: 14,
        greenEvents: 16,
        darkEvents: 10,
      },
      {
        signalGroup: 5,
        redEvents: 12,
        yellowEvents: 14,
        greenEvents: 16,
        darkEvents: 10,
      },
      {
        signalGroup: 5,
        redEvents: 12,
        yellowEvents: 14,
        greenEvents: 16,
        darkEvents: 10,
      },
    ],
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Signal State Passage Assessment
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="overline">
              % of Vehicles Passage Events on Red
            </Typography>
            {mockAssessment === undefined ? (
              <Typography color="textPrimary" variant="h5" key={""}>
                No Data
              </Typography>
            ) : (
              <BarChart
                width={500}
                height={300}
                data={mockAssessment.signalStateEventAssessmentGroup.map((group) => {
                  const total =
                    Math.max(group.redEvents + group.yellowEvents + group.greenEvents + group.darkEvents, 1) / 100;
                  return {
                    name: `${group.signalGroup}`,
                    red: group.redEvents / total,
                    yellow: group.yellowEvents / total,
                    green: group.greenEvents / total,
                    dark: group.darkEvents / total,
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
                <Tooltip />
                <Legend />
                <Bar dataKey="red" stackId="a" fill="#ff0000" />
                <Bar dataKey="yellow" stackId="a" fill="#d3df00" />
                <Bar dataKey="green" stackId="a" fill="#00cc0a" />
                <Bar dataKey="dark" stackId="a" fill="#323232" />
              </BarChart>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
