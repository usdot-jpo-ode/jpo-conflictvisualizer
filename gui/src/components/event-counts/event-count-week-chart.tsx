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
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

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
        }
        })
        .catch((error) => console.error(error));

    }
  }
}, [intersectionId]);

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload) {
    const obj = payload[0].payload;
    return (
      <div
        key={obj.date}
        style={{
          padding: "6px",
          backgroundColor: "white",
          border: "1px solid grey",
        }}
      >
        <b>{obj.date}</b>
        <p>{obj.count} messages</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
        </div>
      </div>
    );
  }
  return null;
};

return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Card sx={{ minWidth: '300px'}}>
      <CardHeader
        title={
          <Typography color="textSecondary" gutterBottom variant="overline">
            {`Seven-day ${eventLabel} trend`}
          </Typography>
        }
        sx={{ pb: 0 }}
      />         
      <CardContent sx={{ pt: 1}}>
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
            <Tooltip content={CustomTooltip} />
            <Bar dataKey="count" fill="#463af1" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </LocalizationProvider>
);
};
