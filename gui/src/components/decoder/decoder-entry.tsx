import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import NextLink from "next/link";
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

// type DecoderApiResponseGeneric = {
//   type: DECODER_MESSAGE_TYPE;
//   odeReceivedAt: number;
//   decoderMessages: string[];
//   j2735Paylaod: string;
//   payload: any;
// };

type DecoderEntryProps = {
  onSelected: (id: string) => void;
  onTextChanged: (id: string, messageText: string) => void;
  onDeleted: (id: string) => void;
};

export const DecoderEntry = (props: DecoderDataEntry & DecoderEntryProps) => {
  const { id, status, selected, text, isGreyedOut, decodedResponse, onSelected, onTextChanged, onDeleted } = props;

  const handleCheckboxChange = () => {
    onSelected(id);
  };

  const handleTextChange = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onTextChanged(id, event.target.value);
  };

  const handleDeleteClick = () => {
    onDeleted(id);
  };

  const getCellColor = () => {
    if (isGreyedOut) {
      return "lightgray";
    }

    switch (status) {
      case "NOT_STARTED":
        return "white";
      case "IN_PROGRESS":
        return "yellow";
      case "COMPLETED":
        return "green";
      case "ERROR":
        return "red";
      default:
        return "white";
    }
  };

  return (
    <TableRow>
      <TableCell style={{ backgroundColor: getCellColor() }}>
        <Checkbox checked={selected} onChange={handleCheckboxChange} />
        <TextField value={text} placeholder="Paste data here" onChange={handleTextChange} />
        <IconButton aria-label="delete" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
        {status === "IN_PROGRESS" && <CircularProgress />}
        <Box>
          <TextField value={decodedResponse?.decodeErrors} InputProps={{ readOnly: true }} fullWidth />
        </Box>
      </TableCell>
    </TableRow>
  );
};
