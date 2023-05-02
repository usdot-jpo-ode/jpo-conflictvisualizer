import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createEmotionCache } from "../utils/create-emotion-cache";
import { registerChartJs } from "../utils/register-chart-js";
import { theme } from "../theme";
import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Toaster } from "react-hot-toast";

import "../theme/index.css";

process.env.KEYCLOAK_CLIENT_ID = "conflictvisualizer-gui";
process.env.KEYCLOAK_REALM = "conflictvisualizer";
process.env.MAPBOX_TOKEN =
  "pk.eyJ1IjoidG9ueWVuZ2xpc2giLCJhIjoiY2tzajQwcDJvMGQ3bjJucW0yaDMxbThwYSJ9.ff26IdP_Y9hiE82AGx_wCg";
process.env.DOCKER_HOST_IP = "172.28.204.101";

registerChartJs();

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Material Kit Pro</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SessionProvider session={session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>
        </ThemeProvider>
      </LocalizationProvider>
      <Toaster />
    </CacheProvider>
  );
};

export default App;
