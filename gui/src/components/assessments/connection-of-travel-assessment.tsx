import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

export const ConnectionOfTravelAssessmentCard = (props: {
  assessment: ConnectionOfTravelAssessment | undefined;
  small: Boolean;
}) => {
  const { assessment } = props;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Connection of Travel Assessment
            </Typography>
            {assessment === undefined ? (
              <Typography color="textPrimary" variant="h5" key={""}>
                No Data
              </Typography>
            ) : (
              assessment.connectionOfTravelAssessmentGroups.map((group) => {
                return (
                  <Typography color="textPrimary" variant="h5" key={group.connectionID}>
                    {`segment: ${group.ingressLaneID}, lane: ${group.egressLaneID}, ${group.eventCount} Events`}
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
