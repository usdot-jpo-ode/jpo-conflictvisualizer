import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from "recharts";

export const StopLineStopAssessmentCard = (props: { assessment: StopLineStopAssessment | undefined }) => {
  const { assessment } = props;

  const mockAssessment = {
    stopLineStopAssessmentGroup: [
      {
        signalGroup: 1,
        timeStoppedOnRed: 10,
        timeStoppedOnYellow: 10,
        timeStoppedOnGreen: 10,
        timeStoppedOnDark: 10,
      },
      {
        signalGroup: 2,
        timeStoppedOnRed: 5,
        timeStoppedOnYellow: 15,
        timeStoppedOnGreen: 0,
        timeStoppedOnDark: 20,
      },
      {
        signalGroup: 3,
        timeStoppedOnRed: 15,
        timeStoppedOnYellow: 15,
        timeStoppedOnGreen: 0,
        timeStoppedOnDark: 0,
      },
      {
        signalGroup: 4,
        timeStoppedOnRed: 1,
        timeStoppedOnYellow: 1,
        timeStoppedOnGreen: 23,
        timeStoppedOnDark: 2,
      },
      {
        signalGroup: 5,
        timeStoppedOnRed: 12,
        timeStoppedOnYellow: 14,
        timeStoppedOnGreen: 16,
        timeStoppedOnDark: 10,
      },
    ],
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Signal State Stop Assessment
            </Typography>
            {assessment === undefined || assessment.stopLineStopAssessmentGroup === undefined ? (
              <Typography color="textPrimary" variant="h5" key={""}>
                No Data
              </Typography>
            ) : (
              <BarChart
                width={500}
                height={300}
                data={mockAssessment.stopLineStopAssessmentGroup.map((group) => {
                  const total =
                    Math.max(
                      group.timeStoppedOnRed +
                        group.timeStoppedOnYellow +
                        group.timeStoppedOnGreen +
                        group.timeStoppedOnDark,
                      1
                    ) / 100;
                  return {
                    name: `${group.signalGroup}`,
                    red: group.timeStoppedOnRed / total,
                    yellow: group.timeStoppedOnYellow / total,
                    green: group.timeStoppedOnGreen / total,
                    dark: group.timeStoppedOnDark / total,
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
