import {
  Box,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  CardHeader,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import EventsApi from '../../apis/events-api';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AdapterDateFns from '@date-io/date-fns';

export const EventCountWidget = (props: {
  accessToken: string | undefined;
  intersectionId: number;
}) => {
  const { accessToken, intersectionId } = props;

const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
const [bsmCount, setBsmCount] = useState(0);
const [spatCount, setSpatCount] = useState(0);

useEffect(() => {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  setStartDate(dayStart);
  const dayEnd = new Date();
  dayEnd.setHours(23, 59, 59, 0);
  setEndDate(dayEnd);
}, []);

useEffect(() => {
  if (accessToken) {
    const bsmCountPromise = EventsApi.getEventCount(
      accessToken,
      "bsm",
      intersectionId,
      startDate,
      endDate
    );
    bsmCountPromise.then((count) => setBsmCount(count))
    .catch(error => console.error(error));

    const spatCountPromise = EventsApi.getEventCount(
      accessToken,
      "spat",
      intersectionId,
      startDate,
      endDate
    );
    spatCountPromise.then((count) => setSpatCount(count))
    .catch(error => console.error(error));
  }

}, [startDate, endDate, intersectionId]);

return (
  <Box display="flex" justifyContent="flex-start">
    <Container maxWidth="sm">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Card>
          <CardHeader 
            title={`Message Counts between ${startDate.toLocaleString(undefined, {
              dateStyle: 'short',
              timeStyle: 'short',
              hour12: false,
            })} and ${endDate.toLocaleString(undefined, {
              dateStyle: 'short',
              timeStyle: 'short',
              hour12: false,
            })}`} 
            sx={{ pb: 0 }} 
          />
          <CardContent sx={{ pt: 2 }}>
            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={(newStartDate) => setStartDate(newStartDate || new Date())}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="End Date"
              value={endDate}
              onChange={(newEndDate) => setEndDate(newEndDate || new Date())}
              renderInput={(params) => <TextField {...params} />}
            />
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
        </LocalizationProvider>
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
