import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createEmotionCache } from "../utils/create-emotion-cache";
import { registerChartJs } from "../utils/register-chart-js";
import { theme } from "../theme";
import React from "react";
import { Toaster } from "react-hot-toast";

import "../theme/index.css";
import { Provider } from "react-redux";
import { wrapper } from "../store";
import { AuthGuardKeycloak } from "../components/auth-guard-keycloak";

registerChartJs();

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { ...pageProps },
  } = props;

  const getLayout = Component.getLayout ?? ((page) => page);
  const { store } = wrapper.useWrappedStore({});

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Material Kit Pro</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthGuardKeycloak content={getLayout(<Component {...pageProps} />)} />
          </ThemeProvider>
        </LocalizationProvider>
        <Toaster />
      </CacheProvider>
    </Provider>
  );
};

export default App;
