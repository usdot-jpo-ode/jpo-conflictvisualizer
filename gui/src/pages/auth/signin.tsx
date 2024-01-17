import { useState, useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Logo } from "../../components/logo";
import React from "react";
import getConfig from "next/config";
import { selectKeycloakClient } from "../../slices/userSlice";
import { useSelector } from "react-redux";

const { publicRuntimeConfig } = getConfig();

const Page = () => {
  const keycloakClient = useSelector(selectKeycloakClient);

  return (
    <>
      <Head>
        <title>Sign in | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: "1 1 auto",
        }}
      >
        <Grid container sx={{ flex: "1 1 auto" }}>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              backgroundColor: "neutral.50",
              display: "flex",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                p: 3,
              }}
            >
              <NextLink href="/" passHref>
                <a>
                  <Logo
                    sx={{
                      height: 42,
                      width: 42,
                    }}
                  />
                </a>
              </NextLink>
            </Box>
            <Box
              sx={{
                flex: "1 1 auto",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  maxWidth: 500,
                  px: 3,
                  py: "100px",
                  width: "100%",
                }}
              >
                <div>
                  <Typography sx={{ mb: 1 }} variant="h4">
                    Sign In
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }} variant="body2">
                    CIMMS Cloud Management Console
                  </Typography>
                  <div>
                    <div key={"Keycloak"}>
                      <Button
                        onClick={() => {
                          console.log("Signing in with Keycloak...", keycloakClient);
                          keycloakClient?.login({ redirectUri: `${publicRuntimeConfig.GUI_SERVER_URL}/` });
                        }}
                        variant="contained"
                      >
                        Sign in with Keycloak
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                          console.log("Button Clicked");
                        }}
                      >
                        TestButton
                      </Button>
                    </div>

                    <NextLink href="/auth/signup" passHref>
                      <Button
                        component="a"
                        sx={{
                          m: 1,
                          mr: "auto",
                        }}
                        variant="outlined"
                      >
                        -{">"} Sign Up
                      </Button>
                    </NextLink>
                  </div>
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Page;
