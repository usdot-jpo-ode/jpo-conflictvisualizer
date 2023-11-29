import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

export const SignalStateEventAssessmentCard = (props: { assessment: SignalStateEventAssessment | undefined }) => {
  const { assessment } = props;
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
            {assessment === undefined ? (
              <Typography color="textPrimary" variant="h5" key={""}>
                No Data
              </Typography>
            ) : (
              assessment.signalStateEventAssessmentGroup.map((group) => {
                const percentRed =
                  (100 * group.redEvents) / Math.max(group.greenEvents + group.yellowEvents + group.redEvents + group.darkEvents, 1);
                return (
                  <Typography color="textPrimary" variant="h5" key={group.signalGroup}>
                    {`${group.signalGroup}: ${percentRed.toFixed(0)}%`}
                  </Typography>
                );
              })
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
