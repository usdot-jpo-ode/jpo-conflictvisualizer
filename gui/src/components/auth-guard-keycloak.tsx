import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  initKeycloakClient,
  selectKeycloakClient,
  setRefreshToken,
  // Actions
  setToken,
} from "../slices/userSlice";
import getConfig from "next/config";
import Keycloak from "keycloak-js";
import { ReactKeycloakProvider } from "@react-keycloak/web";

const { publicRuntimeConfig } = getConfig();

export const AuthGuardKeycloak = (props: { content: any }) => {
  const dispatch = useDispatch();

  const keycloakClient = useSelector(selectKeycloakClient);
  const [loginDispatched, setLoginDispatched] = useState<boolean>(false);

  const initKeycloakClientLocal = () => {
    console.log("Should Init Keycloak Client");
    if (!keycloakClient) {
      console.log("Start Init Keycloak Client");

      const client = new Keycloak({
        url: `${publicRuntimeConfig.AUTH_SERVER_URL}`,
        realm: `${publicRuntimeConfig.KEYCLOAK_REALM}`,
        clientId: `${publicRuntimeConfig.KEYCLOAK_CLIENT_ID}`,
      });
      dispatch(initKeycloakClient(client));
    }
  };

  useEffect(() => {
    initKeycloakClientLocal();
  }, []);

  useEffect(() => {
    console.log("keycloakClient:", keycloakClient);
    if (keycloakClient) {
      keycloakClient
        .updateToken(300)
        .then(function (refreshed) {
          if (refreshed) {
            console.debug("Token was successfully refreshed");
          } else {
            console.debug("Token is still valid");
          }
        })
        .catch((e) => console.error("Failed to refresh the token, or the session has expired", e));
    }
  }, [keycloakClient]);

  return (
    // <AuthGuard>
    keycloakClient ? (
      <ReactKeycloakProvider
        initOptions={{ onLoad: "login-required" }}
        authClient={keycloakClient}
        onEvent={(event, error) => {
          console.log("onEvent", event, error);
        }}
        onTokens={({ token, refreshToken }) => {
          console.debug("Tokens Generated");
          // Logic to prevent multiple login triggers
          if (!loginDispatched && token && refreshToken) {
            console.debug("onTokens loginDispatched:");
            dispatch(setToken(token));
            dispatch(setRefreshToken(refreshToken));
            setLoginDispatched(true);
          }
          setTimeout(() => setLoginDispatched(false), 5000);
        }}
      >
        {props.content}
      </ReactKeycloakProvider>
    ) : (
      <Typography>Keycloak Client Not Initialized {keycloakClient} client</Typography>
    )
    // </AuthGuard>
  );
};
