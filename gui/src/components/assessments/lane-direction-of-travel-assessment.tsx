import { Avatar, Box, Card, CardContent, Grid, Typography, IconButton } from "@mui/material";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import React from "react";
import NextLink from "next/link";

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
            {assessment === undefined
              ? ""
              : assessment.laneDirectionOfTravelAssessmentGroup.map((group) => {
                  const percentInvalid =
                    group.outOfToleranceEvents /
                    Math.min(group.inToleranceEvents + group.outOfToleranceEvents, 1);
                  return (
                    <Typography color="textPrimary" variant="h5">
                      {`${group.segmentID}/${group.laneID}: ${percentInvalid.toFixed(2)}%`}
                    </Typography>
                  );
                })}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
