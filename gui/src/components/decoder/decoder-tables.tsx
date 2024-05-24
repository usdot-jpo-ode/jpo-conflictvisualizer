import PerfectScrollbar from "react-perfect-scrollbar";
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import { DecoderEntry } from "./decoder-entry";

type DecoderTableProps = {
  contents: DecoderDataEntry[];
  selectedIntersectionId: number;
  onItemSelected: (id: string) => void;
  onTextChanged: (id: string, messageText: string, type: DECODER_MESSAGE_TYPE) => void;
  onItemDeleted: (id: string) => void;
};

export const DecoderTables = (props: DecoderTableProps) => {
  const { contents, selectedIntersectionId, onItemSelected, onTextChanged, onItemDeleted } = props;

  const getIntersectionId = (decodedResponse: DecoderApiResponseGeneric | undefined) => {
    if (!decodedResponse) {
      return undefined;
    }

    switch (decodedResponse.type) {
      case "MAP":
        const mapPayload = decodedResponse.processedMap;
        return mapPayload?.properties?.intersectionId;
      case "SPAT":
        const spatPayload = decodedResponse.processedSpat;
        return spatPayload?.intersectionId;
      case "BSM":
        return undefined;
    }
  };

  const isGreyedOut = (intersectionId: number | undefined) => {
    return (
      intersectionId !== undefined && selectedIntersectionId !== undefined && intersectionId !== selectedIntersectionId
    );
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box display="flex" justifyContent="space-between" sx={{ minWidth: 1050, overflowY: "scroll" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MAP Messages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contents
                  .filter((v) => v.type === "MAP")
                  .map((entry) => {
                    return (
                      <DecoderEntry
                        id={entry.id}
                        status={entry.status}
                        type={entry.type}
                        text={entry.text}
                        isGreyedOut={isGreyedOut(getIntersectionId(entry.decodedResponse))}
                        decodedResponse={entry.decodedResponse}
                        selected={entry.selected}
                        onSelected={onItemSelected}
                        onTextChanged={(id, text) => onTextChanged(id, text, "MAP")}
                        onDeleted={onItemDeleted}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SPAT Messages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contents
                  .filter((v) => v.type === "SPAT")
                  .map((entry) => {
                    return (
                      <DecoderEntry
                        id={entry.id}
                        status={entry.status}
                        type={entry.type}
                        text={entry.text}
                        isGreyedOut={isGreyedOut(getIntersectionId(entry.decodedResponse))}
                        decodedResponse={entry.decodedResponse}
                        selected={entry.selected}
                        onSelected={onItemSelected}
                        onTextChanged={(id, text) => onTextChanged(id, text, "SPAT")}
                        onDeleted={onItemDeleted}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>BSM Messages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contents
                  .filter((v) => v.type === "BSM")
                  .map((entry) => {
                    return (
                      <DecoderEntry
                        id={entry.id}
                        status={entry.status}
                        type={entry.type}
                        text={entry.text}
                        isGreyedOut={isGreyedOut(getIntersectionId(entry.decodedResponse))}
                        decodedResponse={entry.decodedResponse}
                        selected={entry.selected}
                        onSelected={onItemSelected}
                        onTextChanged={(id, text) => onTextChanged(id, text, "BSM")}
                        onDeleted={onItemDeleted}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};
