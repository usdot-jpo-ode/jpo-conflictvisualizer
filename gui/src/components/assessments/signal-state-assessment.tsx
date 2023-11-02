import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

export const SignalStateAssessmentCard = (props: { assessment: StopLineStopAssessment | undefined }) => {
  const { assessment } = props;
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Signal State Stop Assessment
            </Typography>
            {(assessment === undefined || assessment.stopLineStopAssessmentGroup === undefined) ? (
              <Typography color="textPrimary" variant="h5" key={""}>
                No Data
              </Typography>
            ) : (
              assessment.stopLineStopAssessmentGroup.map((group) => {
                const percentRed =
                  (100 * group.timeStoppedOnRed) / Math.max(group.timeStoppedOnRed + group.timeStoppedOnYellow + group.timeStoppedOnGreen + group.timeStoppedOnDark, 1);
                return (
                  <Typography color="textPrimary" variant="h5" key={group.signalGroup}>
                    {`signal group: ${group.signalGroup},  ${percentRed.toFixed(0)}% Red Events`}
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
