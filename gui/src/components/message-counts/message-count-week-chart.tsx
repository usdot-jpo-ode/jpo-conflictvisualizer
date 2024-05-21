import {
  Card,
  Typography,
  CardHeader,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState} from "react";
import EventsApi from '../../apis/events-api';
import {LocalizationProvider } from '@mui/x-date-pickers';
import AdapterDateFns from '@date-io/date-fns';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export const MessageCountWeekChart = (props: {
  accessToken: string | undefined;
  intersectionId: number;
  messageType: string;
  messageLabel: string;
  barColor: string;
  disclaimer: string | undefined;
}) => {
  const { accessToken, intersectionId, messageType, messageLabel, barColor, disclaimer } = props;

  type ChartData = { date: string; count: number; dayOfWeek: string };

  const [messageCounts, setMessageCounts] = useState<ChartData[]>([]);

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

      const messageCountPromise = EventsApi.getMessageCount(
        accessToken,
        messageType,
        intersectionId,
        dayStart,
        dayEnd
      );
      messageCountPromise
        .then((count) => {
          weekCounts[i] = { 
            date: dayStart.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }), 
            count: count,
            dayOfWeek: dayStart.toLocaleDateString(undefined, { weekday: 'long' })
          };
          if (i === 6) {
            setMessageCounts(weekCounts);
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
        <b>{obj.dayOfWeek} {obj.date}</b>
        <p>{obj.count.toLocaleString()} messages</p>
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
    <Card sx={{ minWidth: '300px', overflow: "visible" }}>
      <CardHeader
        title={
          <Typography color="textSecondary" gutterBottom variant="overline">
            {`Seven-day ${messageLabel} trend`}
          </Typography>
        }
        sx={{ pb: 0 }}
      />         
      <CardContent sx={{ pt: 1}}>
        <ResponsiveContainer height={250}>
          <LineChart data={messageCounts} margin={{ top: 5, right: 5}}>
            <XAxis
              dataKey="date"
              interval={0}
              angle={-45}
              height={50}
              textAnchor="end"
            />
            <YAxis 
              label={{ value: 'Message count', angle: -90, dx:-25 }}
              interval={0}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${value / 1000000}M`;
                } else if (value >= 1000) {
                  return `${value / 1000}K`;
                } else {
                  return value;
                }
              }}
            />
            <Tooltip content={CustomTooltip} />
            <Line type="monotone" dataKey="count" stroke={barColor} />
          </LineChart>
        </ResponsiveContainer>
        </CardContent>
      <CardContent sx={{ pt: 0, mt: -4, height: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        {disclaimer && (
          <Typography variant="caption" color="textSecondary">
            *{disclaimer}
          </Typography>
        )}
      </CardContent>
    </Card>
  </LocalizationProvider>
);
};
