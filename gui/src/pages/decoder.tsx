import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Button, Container } from "@mui/material";
import DecoderApi from "../apis/decoder-api";
import { DashboardLayout } from "../components/dashboard-layout";
import { useDashboardContext } from "../contexts/dashboard-context";
import { useSession } from "next-auth/react";
import MapDialog from "../components/intersection-selector/intersection-selector-dialog";
import { DecoderTables } from "../components/decoder/decoder-tables";
import { v4 as uuidv4 } from "uuid";
import { DecoderMapDialog } from "../components/decoder/decoder-map-dialog";
import { Plus as PlusIcon } from "../icons/plus";
import MapIcon from "@mui/icons-material/Map";

const DecoderPage = () => {
  const { data: session } = useSession();

  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [data, setData] = useState({} as { [id: string]: DecoderDataEntry });
  const [selectedMapMessage, setSelectedMapMessage] = useState(
    undefined as undefined | { id: string; intersectionId: number; rsuIp: string }
  );

  console.log("Data", data);

  useEffect(() => {
    const freshData = [] as DecoderDataEntry[];
    for (let i = 0; i < 3; i++) {
      freshData.push({
        id: uuidv4(),
        type: i % 3 == 0 ? "MAP" : i % 3 == 1 ? "SPAT" : "BSM",
        status: "NOT_STARTED",
        text: "",
        selected: false,
        isGreyedOut: false,
        decodedResponse: undefined,
      });
    }
    setData(freshData.reduce((acc, entry) => ({ ...acc, [entry.id]: entry }), {}));
  }, []);

  const submitDecoderRequest = (data: string, type: DECODER_MESSAGE_TYPE) => {
    if (session?.accessToken) {
      return DecoderApi.submitDecodeRequest({
        token: session.accessToken,
        data,
        type,
      });
    } else {
      console.error("Did not attempt to update user automatically. Access token:", Boolean(session?.accessToken));
      return undefined;
    }
  };

  const onTextChanged = (id: string, text: string, type: DECODER_MESSAGE_TYPE) => {
    setData((prevData) => {
      submitDecoderRequest(text, type)?.then((response) => {
        setData((prevData) => {
          return {
            ...prevData,
            [id]: {
              ...prevData[id],
              decodedResponse: response,
              status: text == "" ? "NOT_STARTED" : response == undefined ? "ERROR" : "COMPLETED",
            },
          };
        });
      });
      let newEntry = {};
      if (prevData[id].text != undefined) {
        let newId = uuidv4();
        newEntry[newId] = {
          id: newId,
          type: type,
          status: "NOT_STARTED",
          text: "",
          selected: false,
          isGreyedOut: false,
          decodedResponse: undefined,
        };
      }
      return {
        ...prevData,
        ...newEntry,
        [id]: {
          id: id,
          type: type,
          status: "IN_PROGRESS",
          selected: false,
          isGreyedOut: false,
          text: text,
          decodedResponse: undefined,
        },
      };
    });
  };

  const onItemDeleted = (id: string) => {
    if (data[id]?.text != "") {
      setData((prevData) => {
        delete prevData[id];
        return { ...prevData };
      });
    }
  };

  const onItemSelected = (id: string) => {
    const intersectionId = data[id]?.decodedResponse?.processedMap?.properties?.intersectionId;
    const rsuIp = data[id]?.decodedResponse?.processedMap?.properties?.originIp;
    if (intersectionId) {
      setSelectedMapMessage({ id, intersectionId, rsuIp: rsuIp! });
    }
  };

  const onFileUploaded = (contents: string[], type: DECODER_MESSAGE_TYPE) => {
    setData((prevData) => {
      const textToIds: { [text: string]: string } = {};
      contents.forEach((text) =>
        submitDecoderRequest(text, type)?.then((response) => {
          const id = uuidv4();
          textToIds[text] = id;
          setData((prevData) => {
            return {
              ...prevData,
              [id]: {
                ...prevData[text],
                decodedResponse: response,
                status: text == "" ? "NOT_STARTED" : response == undefined ? "ERROR" : "COMPLETED",
              },
            };
          });
        })
      );
      let newEntries = {};
      contents.forEach((text) => {
        newEntries[textToIds[text]] = {
          id: textToIds[text],
          type: type,
          status: "IN_PROGRESS",
          text: text,
          selected: false,
          isGreyedOut: false,
          decodedResponse: undefined,
        };
      });
      return {
        ...prevData,
        ...newEntries,
      };
    });
  };

  return (
    <>
      <Head>
        <title>ASN.1 Decoder</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          flexGrow: 1,
          py: 8,
        }}
      >
        {/* <Container maxWidth={false}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div>
              <Typography noWrap variant="h4">
                Query
              </Typography>
            </div>
          </Box>
          <Box mt={3}>
            <DataSelectorEditForm
              onQuery={query}
              onVisualize={onVisualize}
              roadRegulatorIntersectionIds={roadRegulatorIntersectionIds}
              dbIntersectionId={intersectionId}
            />
          </Box>
        </Container> */}
        <Container sx={{ mt: 5, alignItems: "center", display: "flex" }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setOpenMapDialog(true);
            }}
            startIcon={<MapIcon fontSize="medium" />}
            sx={{ m: 1 }}
          >
            Display Selected Data On Map
          </Button>
        </Container>
        <Container sx={{ mt: 5, alignItems: "center", display: "flex" }}>
          <DecoderTables
            contents={Object.values(data)}
            selectedIntersectionId={selectedMapMessage?.intersectionId}
            selectedMapMessageId={selectedMapMessage?.id}
            selectedRsuIp={selectedMapMessage?.rsuIp}
            onItemSelected={onItemSelected}
            onTextChanged={onTextChanged}
            onItemDeleted={onItemDeleted}
            onFileUploaded={onFileUploaded}
          />
        </Container>
      </Box>
      <DecoderMapDialog
        open={openMapDialog}
        onClose={() => {
          setOpenMapDialog(false);
        }}
        intersectionId={-1}
        roadRegulatorId={-1}
        map={Object.values(data)
          .filter((v) => v.type === "MAP" && v.status == "COMPLETED")
          .map((v) => v.decodedResponse?.processedMap!)}
        spat={Object.values(data)
          .filter((v) => v.type === "SPAT" && v.status == "COMPLETED")
          .map((v) => v.decodedResponse?.processedSpat!)}
        bsm={Object.values(data)
          .filter((v) => v.type === "BSM" && v.status == "COMPLETED")
          .map((v) => v.decodedResponse?.bsm!)}
      />
    </>
  );
};

DecoderPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DecoderPage;
