import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
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
  Chip,
  Typography,
} from "@mui/material";
import React from "react";
import { PencilAlt as PencilAltIcon } from "../../icons/pencil-alt";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

export const ConfigParamListTable = (props) => {
  const { parameters, parametersCount, onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    props;

  const readOnlyRow = (param) => {
    return (
      <TableRow hover key={param.id}>
        <TableCell>{param.key}</TableCell>
        <TableCell>{param.value.toString()}</TableCell>
        <TableCell>{param.units?.toString()}</TableCell>
        <TableCell>{param.description}</TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
    );
  };

  const generalDefaultRow = (param) => {
    return (
      <TableRow hover key={param.id}>
        <TableCell>{param.key}</TableCell>
        <TableCell>{param.value.toString()}</TableCell>
        <TableCell>{param.units?.toString()}</TableCell>
        <TableCell>{param.description}</TableCell>
        <TableCell align="right">
          <NextLink href={`/configuration/${param.key}/edit`} passHref>
            <IconButton component="a">
              <PencilAltIcon fontSize="small" />
            </IconButton>
          </NextLink>
        </TableCell>
      </TableRow>
    );
  };

  const generalIntersectionRow = (param) => {
    return (
      <TableRow hover key={param.id}>
        <TableCell>{param.key}</TableCell>
        <TableCell>{param.value.toString()}</TableCell>
        <TableCell>{param.units?.toString()}</TableCell>
        <TableCell>{param.description}</TableCell>
        <TableCell align="right">
          <NextLink href={`/configuration/${param.key}/create`} passHref>
            <IconButton component="a">
              <AddIcon fontSize="small" />
            </IconButton>
          </NextLink>
          <NextLink href={`/configuration/${param.key}/edit`} passHref>
            <IconButton component="a">
              <PencilAltIcon fontSize="small" />
            </IconButton>
          </NextLink>
        </TableCell>
      </TableRow>
    );
  };

  const intersectionRow = (param) => {
    return (
      <TableRow hover key={param.id}>
        <TableCell>{param.key}</TableCell>
        <TableCell>
          {param.value.toString()}
          {
            <Chip
              color="secondary"
              sx={{ ml: 3 }}
              label={
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: "600",
                  }}
                >
                  Overrriden
                </Typography>
              }
              size="small"
            />
          }
        </TableCell>
        <TableCell>{param.unit}</TableCell>
        <TableCell>{param.description}</TableCell>
        <TableCell align="right">
          <NextLink href={`/configuration/${param.key}/edit`} passHref>
            <IconButton component="a">
              <PencilAltIcon fontSize="small" />
            </IconButton>
          </NextLink>
          <NextLink href={`/configuration/${param.key}/remove`} passHref>
            <IconButton component="a">
              <CancelIcon fontSize="small" />
            </IconButton>
          </NextLink>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(parameters as Config[]).map((param) => {
                if (param.updateType === "READ_ONLY") return readOnlyRow(param);
                if (param.updateType === "DEFAULT") return generalDefaultRow(param);
                if (param.updateType === "INTERSECTION") {
                  return param.intersectionID == null
                    ? generalIntersectionRow(param)
                    : intersectionRow(param);
                }
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={parametersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ConfigParamListTable.propTypes = {
  parameters: PropTypes.array.isRequired,
  parametersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
