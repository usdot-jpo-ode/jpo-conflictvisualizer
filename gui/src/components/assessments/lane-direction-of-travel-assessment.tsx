import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

export const LaneDirectionOfTravelAssessmentCard = (props: {
  assessment: LaneDirectionOfTravelAssessment | undefined;
}) => {
  const { assessment } = props;
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
              assessment.laneDirectionOfTravelAssessmentGroup.map((group) => {
                const percentInvalid =
                  (100 * group.outOfToleranceEvents) /
                  Math.min(group.inToleranceEvents + group.outOfToleranceEvents, 1);
                return (
                  <Typography color="textPrimary" variant="h5" key={group.segmentID}>
                    {`segment: ${group.segmentID}, lane: ${group.laneID}, ${percentInvalid.toFixed(0)}% Invalid`}
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
