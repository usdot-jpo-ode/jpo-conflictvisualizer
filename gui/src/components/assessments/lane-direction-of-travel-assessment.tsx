import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from "recharts";

export const LaneDirectionOfTravelAssessmentCard = (props: {
  assessment: LaneDirectionOfTravelAssessment | undefined;
}) => {
  const { assessment } = props;

  const mockAssessment = {
    laneDirectionOfTravelAssessmentGroup: [
      {
        laneID: 1,
        segmentID: 1,
        inToleranceEvents: 10,
        outOfToleranceEvents: 10,
      },
      {
        laneID: 1,
        segmentID: 2,
        inToleranceEvents: 5,
        outOfToleranceEvents: 25,
      },
      {
        laneID: 1,
        segmentID: 3,
        inToleranceEvents: 55,
        outOfToleranceEvents: 12,
      },
      {
        laneID: 1,
        segmentID: 4,
        inToleranceEvents: 23,
        outOfToleranceEvents: 32,
      },
      {
        laneID: 1,
        segmentID: 5,
        inToleranceEvents: 12,
        outOfToleranceEvents: 34,
      },
      {
        laneID: 2,
        segmentID: 1,
        inToleranceEvents: 11,
        outOfToleranceEvents: 9,
      },
      {
        laneID: 2,
        segmentID: 2,
        inToleranceEvents: 12,
        outOfToleranceEvents: 25,
      },
      {
        laneID: 2,
        segmentID: 3,
        inToleranceEvents: 12,
        outOfToleranceEvents: 52,
      },
      {
        laneID: 2,
        segmentID: 4,
        inToleranceEvents: 22,
        outOfToleranceEvents: 12,
      },
      {
        laneID: 3,
        segmentID: 1,
        inToleranceEvents: 1,
        outOfToleranceEvents: 9,
      },
      {
        laneID: 3,
        segmentID: 2,
        inToleranceEvents: 12,
        outOfToleranceEvents: 25,
      },
      {
        laneID: 4,
        segmentID: 1,
        inToleranceEvents: 1,
        outOfToleranceEvents: 9,
      },
      {
        laneID: 4,
        segmentID: 3,
        inToleranceEvents: 12,
        outOfToleranceEvents: 52,
      },
      {
        laneID: 4,
        segmentID: 4,
        inToleranceEvents: 22,
        outOfToleranceEvents: 12,
      },
      {
        laneID: 5,
        segmentID: 1,
        inToleranceEvents: 1,
        outOfToleranceEvents: 9,
      },
      {
        laneID: 5,
        segmentID: 2,
        inToleranceEvents: 12,
        outOfToleranceEvents: 25,
      },
    ],
  };

  function getWidthFactorFromData(data: any[]): number {
    if (!data) return 0.1;
    const maxFactor = 0.9;
    const numRowsForMax = 40;
    return 0.1 + Math.min(maxFactor, data.length / numRowsForMax);
  }

  const widthFactor = getWidthFactorFromData(mockAssessment?.laneDirectionOfTravelAssessmentGroup);
  const SegColors = [
    ["#bde671", "#ff9582"],
    ["#8fdf4d", "#fd7f69"],
    ["#78be4a", "#fd6d53"],
    ["#57be4a", "#fd5d41"],
    ["#43ce43", "#ff593c"],
    ["#41cc00", "#ff3737"],
    ["#1fbd0b", "#ff2626"],
    ["#439c19", "#f02944"],
    ["#428f2b", "#da3939"],
    ["#149b02", "#c52828"],
    ["#0d6901", "#971313"],
    ["#0e5201", "#920000"],
  ];

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  const segmentIds = mockAssessment?.laneDirectionOfTravelAssessmentGroup
    .map((group) => group.segmentID)
    .sort((a, b) => a - b)
    .reverse()
    .filter(onlyUnique);
  const maxSegmentId = Math.max(...segmentIds);

  const compressedGroups: {
    [key: number]: {
      laneId: number;
      [key: string]: number;
    };
  } = {};
  for (let i = 0; i < mockAssessment?.laneDirectionOfTravelAssessmentGroup.length; i++) {
    const group = mockAssessment?.laneDirectionOfTravelAssessmentGroup[i];
    const keyGood = `inToleranceEventsSeg${group.segmentID}`;
    const keyBad = `outOfToleranceEventsSeg${group.segmentID}`;
    if (!compressedGroups[group.laneID]) {
      compressedGroups[group.laneID] = {
        laneId: group.laneID,
      };
    }
    compressedGroups[group.laneID][keyGood] = group.inToleranceEvents;
    compressedGroups[group.laneID][keyBad] = group.outOfToleranceEvents;
  }

  return (
    <Grid item width={100 + widthFactor * 1200}>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="overline">
                Lane Direction of Travel Assessment
              </Typography>
              {mockAssessment === undefined ? (
                <Typography color="textPrimary" variant="h5" key={""}>
                  No Data
                </Typography>
              ) : (
                <BarChart
                  width={widthFactor * 1200}
                  height={400}
                  data={Object.values(compressedGroups).map((group) => {
                    return {
                      name: `${group.laneId}`,
                      ...group,
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
                  <XAxis dataKey="name" label={{ value: "Lane ID", position: "insideBottomRight", offset: -5 }} />
                  <YAxis label={{ value: "Events", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "10px",
                      height: "100px",
                    }}
                  />
                  {segmentIds.map((segmentId, index) => {
                    return (
                      <Bar
                        dataKey={`inToleranceEventsSeg${segmentId}`}
                        stackId={`inTolerance`}
                        name={`seg${segmentId}Good`}
                        fill={SegColors[index * Math.floor(SegColors.length / maxSegmentId)][0]}
                      />
                    );
                  })}
                  {segmentIds.map((segmentId, index) => {
                    return (
                      <Bar
                        dataKey={`outOfToleranceEventsSeg${segmentId}`}
                        stackId={`outOfTolerance`}
                        name={`seg${segmentId}Bad`}
                        fill={SegColors[index * Math.floor(SegColors.length / maxSegmentId)][1]}
                      />
                    );
                  })}
                  {/* <Bar dataKey="inToleranceEventsSeg1" stackId="a" name="seg1Good" fill="#96be4a" />
                  <Bar dataKey="outOfToleranceEventsSeg1" stackId="b" name="seg1Bad" fill="#da5139" />
                  <Bar dataKey="inToleranceEventsSeg2" stackId="a" name="seg2Good" fill="#41cc00" />
                  <Bar dataKey="outOfToleranceEventsSeg2" stackId="b" name="seg2Bad" fill="#d32000" />
                  <Bar dataKey="inToleranceEventsSeg3" stackId="a" name="seg3Good" fill="#0d6901" />
                  <Bar dataKey="outOfToleranceEventsSeg3" stackId="b" name="seg3Bad" fill="#7a001f" /> */}
                </BarChart>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
