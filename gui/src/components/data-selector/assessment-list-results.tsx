import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import NextLink from "next/link";
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

export const AssessmentListResults = ({
  events,
  eventsCount,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
}) => {
  const getAssessmentDescription = (assessment: Assessment) => {
    // convert event to JSON string
    const newAssessment: any = { ...assessment };
    delete newAssessment["assessmentType"];
    delete newAssessment["assessmentGeneratedAt"];
    delete newAssessment["intersectionId"];
    delete newAssessment["roadRegulatorId"];
    const assessmentString = JSON.stringify(newAssessment);
    return assessmentString.substring(1, assessmentString.length - 1);
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assessment Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell></TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((assessment: Assessment) => {
                return (
                  <TableRow hover key={assessment.assessmentGeneratedAt}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Typography color="textPrimary" variant="body1">
                          {assessment.assessmentType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{format(assessment.assessmentGeneratedAt, "MM/dd/yyyy HH:mm:ss")}</TableCell>
                    <TableCell align="right">
                      <NextLink href={`/map/${assessment.assessmentGeneratedAt}`} passHref>
                        <IconButton component="a">
                          <MapRoundedIcon fontSize="medium" />
                        </IconButton>
                      </NextLink>
                    </TableCell>
                    <TableCell>{getAssessmentDescription(assessment)}</TableCell>
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
