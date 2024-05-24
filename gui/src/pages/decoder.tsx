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

const DecoderPage = () => {
  const { intersectionId } = useDashboardContext();
  const { data: session } = useSession();

  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [data, setData] = useState({} as { [id: string]: DecoderDataEntry });

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
    setData((prevData) => {
      delete prevData[id];
      return { ...prevData };
    });
  };

  const onItemSelected = (id: string) => {
    setData((prevData) => {
      return {
        ...prevData,
        [id]: {
          ...prevData[id],
          selected: !prevData[id].selected,
        },
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
        <Box
          sx={{
            m: -1,
            mt: 3,
            mb: 3,
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setOpenMapDialog(true);
            }}
            startIcon={<PlusIcon fontSize="small" />}
            sx={{ m: 1 }}
          >
            Refresh
          </Button>
        </Box>
        <Container sx={{ mt: 5, alignItems: "center", display: "flex" }}>
          <DecoderTables
            contents={Object.values(data)}
            selectedIntersectionId={intersectionId}
            onItemSelected={onItemSelected}
            onTextChanged={onTextChanged}
            onItemDeleted={onItemDeleted}
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
