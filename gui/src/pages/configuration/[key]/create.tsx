import { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import { configParamApi } from "../../../apis/configuration-param-api";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { ConfigParamCreateForm } from "../../../components/configuration/configuration-create-form";
import { useDashboardContext } from "../../../contexts/dashboard-context";
import { useSession } from "next-auth/react";

const ConfigParamCreate = () => {
  const { intersectionId, roadRegulatorId } = useDashboardContext();
  const [parameter, setParameter] = useState<Config | undefined>(undefined);
  const { data: session } = useSession();

  const router = useRouter();
  const { key } = router.query;

  const getParameter = async (key: string) => {
    if (intersectionId && roadRegulatorId && session?.accessToken) {
      try {
        const data = await configParamApi.getParameter(
          session?.accessToken,
          key,
          roadRegulatorId.toString(),
          intersectionId.toString()
        );

        setParameter(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getParameter(key as string);
  }, []);

  if (!parameter) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Override Parameter</title>
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
            <ConfigParamCreateForm parameter={parameter} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

ConfigParamCreate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ConfigParamCreate;
