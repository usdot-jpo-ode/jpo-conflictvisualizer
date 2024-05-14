import Head from "next/head";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  Typography,
  CardHeader,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import EventsApi from '../../apis/events-api';
import { Token } from "@mui/icons-material";

export const EventCountDataTable = (props: {
  accessToken: string | undefined;
  intersectionId: number;
}) => {
  const { accessToken, intersectionId } = props;
  const queryRef = useRef<TextFieldProps>(null);
  const [currentDescription, setCurrentDescription] = useState("");

const date = new Date();
const [bsmCount, setBsmCount] = useState(0);
const [spatCount, setSpatCount] = useState(0);

useEffect(() => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 0);

  if (accessToken) {
    const bsmCountPromise = EventsApi.getEventCount(
      accessToken,
      "bsm",
      intersectionId,
      dayStart,
      dayEnd,
    );
    bsmCountPromise.then((count) => setBsmCount(count))
    .catch(error => console.error(error));

    const spatCountPromise = EventsApi.getEventCount(
      accessToken,
      "spat",
      intersectionId,
      dayStart,
      dayEnd,
    );
    spatCountPromise.then((count) => setSpatCount(count))
    .catch(error => console.error(error));
  }

}, []);

return (
  <Box display="flex" justifyContent="flex-start">
    <Container maxWidth="sm">
    <Card>
      <CardHeader title={`Events on date: ${date.toLocaleDateString()}`} sx={{ pb: 0 }} />
      <CardContent sx={{ pt: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body1">BSM:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{bsmCount !== 0 ? bsmCount : "-"}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">SPAT:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{spatCount !== 0 ? spatCount : "-"}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            m: -1,
            mt: 3,
          }}
        >
        </Box>
      </Box>
    </Container>
  </Box>
);
};
