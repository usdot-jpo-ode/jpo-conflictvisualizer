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
              Signal State Assessment
            </Typography>
            {assessment === undefined ? (
              <Typography color="textPrimary" variant="h5" key={""}>
                No Data
              </Typography>
            ) : (
              assessment.signalStateEventAssessmentGroup.map((group) => {
                const percentRed =
                  (100 * group.redEvents) / Math.min(group.greenEvents + group.yellowEvents + group.redEvents, 1);
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
