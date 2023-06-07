import { Box, Button, Card, Container, Divider, Grid, CardHeader } from "@mui/material";
import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

export const DataVisualizer = (props: { data: any[]; onDownload: () => void }) => {
  const { data, onDownload } = props;

  return (
    <>
      <Container maxWidth={false}>
        <Card>
          <>
            <CardHeader title="Counts" />
            <Divider />
          </>
          <LineChart width={500} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
          </LineChart>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              m: -1,
              mt: 3,
            }}
          >
            <Grid container justifyContent="left" spacing={3}>
              <Grid item>
                <Button
                  sx={{ m: 1 }}
                  variant="contained"
                  onClick={onDownload}
                  disabled={data.length <= 0 ? true : false}
                >
                  Download
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};
