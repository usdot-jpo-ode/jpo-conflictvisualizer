import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from "recharts";

export const SignalStateEventAssessmentCard = (props: { assessment: SignalStateEventAssessment | undefined }) => {
  const { assessment } = props;

  function getWidthFactorFromData(data: any[] | undefined): number {
    if (!data) return 0.1;
    const maxFactor = 0.9;
    const numRowsForMax = 40;
    return 0.1 + Math.min(maxFactor, data.length / numRowsForMax);
  }
  0;
  const widthFactor = getWidthFactorFromData(assessment?.signalStateEventAssessmentGroup);

  return (
    <Grid item width={100 + widthFactor * 1200}>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="overline">
                Signal State Passage Assessment
              </Typography>
              {assessment === undefined ? (
                <Typography color="textPrimary" variant="h5" key={""}>
                  No Data
                </Typography>
              ) : (
                <BarChart
                  width={widthFactor * 1200}
                  height={350}
                  data={assessment.signalStateEventAssessmentGroup.map((group) => {
                    const total =
                      Math.max(group.redEvents + group.yellowEvents + group.greenEvents + group.darkEvents, 1) / 100;
                    return {
                      name: `${group.signalGroup}`,
                      red: Math.round((group.redEvents / total) * 100) / 100,
                      yellow: Math.round((group.yellowEvents / total) * 100) / 100,
                      green: Math.round((group.greenEvents / total) * 100) / 100,
                      dark: Math.round((group.darkEvents / total) * 100) / 100,
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
                  <XAxis dataKey="name" label={{ value: "Signal Group", position: "insideBottomRight", offset: -5 }} />
                  <YAxis unit="%" label={{ value: "Percentage", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "10px",
                      height: "50px",
                    }}
                  />
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
    </Grid>
  );
};
