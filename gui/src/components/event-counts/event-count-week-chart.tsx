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
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from 'recharts';

export const EventCountWeekChart = (props: {
  accessToken: string | undefined;
  intersectionId: number;
  eventType: string;
  eventLabel: string;

}) => {
  const { accessToken, intersectionId, eventType, eventLabel} = props;

  type ChartData = { date: string; count: number };

  const [eventCounts, setEventCounts] = useState<ChartData[]>([]);

useEffect(() => {
  if (accessToken) {
    const weekCounts: ChartData[] = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - (6-i));
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date();
      dayEnd.setDate(dayEnd.getDate() - (6-i));
      dayEnd.setHours(23, 59, 59, 0);

      const eventCountPromise = EventsApi.getEventCount(
        accessToken,
        eventType,
        intersectionId,
        dayStart,
        dayEnd
      );
      eventCountPromise
        .then((count) => {
          weekCounts[i] = { 
            date: dayStart.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }), 
            count: count 
          };
          if (i === 6) {
            setEventCounts(weekCounts);
            console.log(weekCounts);
        }
        })
        .catch((error) => console.error(error));

    }
  }
}, [intersectionId]);

useEffect(() => {
}, [intersectionId]);

return (
  <Container maxWidth="xs">
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ pb: 2 }}>
        <Card>
          <CardHeader 
            title={`Seven-day ${eventLabel} trend`}
            titleTypographyProps={{ align: 'center' }}
            sx={{ pb: 0 }} 
          />            
          <CardContent sx={{ pt: 2}}>
            <ResponsiveContainer height={250}>
              <BarChart data={eventCounts} margin={{ top: 5, right: 30, left: -10}}>
                <XAxis
                  dataKey="date"
                  interval={0}
                  angle={-45}
                  height={50}
                  textAnchor="end"
                />
                <YAxis 
                  label={{ value: 'Message count', angle: -90, dx:-15 }}
                  interval={0}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#463af1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  </Container>
);
};
