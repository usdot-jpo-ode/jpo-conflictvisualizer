import { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import { configParamApi } from "../../../apis/configuration-param-api";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { ConfigParamCreateForm } from "../../../components/configuration/configuration-create-form";
import { useDashboardContext } from "../../../contexts/dashboard-context";

const ConfigParamCreate = () => {
  const { intersectionId: dbIntersectionId } = useDashboardContext();
  const [parameter, setParameter] = useState<Config | null>(null);

  const router = useRouter();
  const { key } = router.query;

  const getParameter = async (key: string) => {
    try {
      const data = await configParamApi.getParameter(
        "token",
        key,
        "-1",
        dbIntersectionId.toString()
      );

      setParameter(data);
    } catch (err) {
      console.error(err);
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
