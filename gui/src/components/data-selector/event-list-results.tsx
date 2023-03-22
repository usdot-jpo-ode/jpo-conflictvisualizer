import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

export const EventListResults = ({
  events,
  eventsCount,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
}) => {
  const getEventDescription = (event: MessageMonitor.Event) => {
    // convert event to JSON string
    const newEvent = { ...event };
    delete newEvent["eventType"];
    delete newEvent["eventGeneratedAt"];
    const eventString = JSON.stringify(newEvent);
    return eventString.substring(1, eventString.length - 1);
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => {
                return (
                  <TableRow hover key={event.id}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Typography color="textPrimary" variant="body1">
                          {event.eventType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{format(event.eventGeneratedAt, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                    <TableCell>{getEventDescription(event)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={eventsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

EventListResults.propTypes = {
  events: PropTypes.array.isRequired,
  onSelectedItemsChanged: PropTypes.func,
};
