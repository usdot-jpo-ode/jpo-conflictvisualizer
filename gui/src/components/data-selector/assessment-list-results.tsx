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

export const AssessmentListResults = ({
  events,
  eventsCount,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
}) => {
  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assessment Type</TableCell>
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
                          {event.assessmentType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(event.assessmentGeneratedAt, "dd/MM/yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell>{event.laneDirectionOfTravelAssessmentGroup.toString()}</TableCell>
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

AssessmentListResults.propTypes = {
  events: PropTypes.array.isRequired,
  onSelectedItemsChanged: PropTypes.func,
};
