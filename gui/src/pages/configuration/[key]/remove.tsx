import { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import { configParamApi } from "../../../apis/configuration-param-api";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { ConfigParamRemoveForm } from "../../../components/configuration/configuration-remove-form";
import { useDashboardContext } from "../../../contexts/dashboard-context";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken } from "../../../slices/userSlice";

const ConfigParamRemove = () => {
  const { intersectionId, roadRegulatorId } = useDashboardContext();
  const dispatch = useDispatch();

  const authToken = useSelector(selectAuthToken);

  const [parameter, setParameter] = useState<Config | undefined>(undefined);

  const router = useRouter();
  const { key } = router.query;

  const getParameter = async (key: string) => {
    if (authToken) {
      try {
        const data = await configParamApi.getParameter(authToken, key, intersectionId, roadRegulatorId);

        setParameter(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Did not attempt to get configuration parameter in remove form. Access token:", authToken);
    }
  };

  useEffect(() => {
    getParameter(key as string);
  }, [intersectionId]);

  if (!parameter) {
    return (
      <>
        <Head>
          <title>Parameter Edit</title>
        </Head>
        <Box
          component="main"
          sx={{
            backgroundColor: "background.default",
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="md">
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <div>
                <Typography noWrap variant="h4">
                  Unable to find parameter {key}
                </Typography>
              </div>
            </Box>
          </Container>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Parameter Edit</title>
        </Head>
        <Box
          component="main"
          sx={{
            backgroundColor: "background.default",
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="md">
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <div>
                <Typography noWrap variant="h4">
                  {parameter.category}/{parameter.key}
                </Typography>
              </div>
            </Box>
            <Box mt={3}>
              <ConfigParamRemoveForm parameter={parameter} defaultParameter={parameter} />
            </Box>
          </Container>
        </Box>
      </>
    );
  }
};

ConfigParamRemove.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ConfigParamRemove;
