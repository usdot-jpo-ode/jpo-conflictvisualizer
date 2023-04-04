import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Logo } from "../../components/logo";
import { getProviders, signIn } from "next-auth/react";
import Router from "next/router";
import React from "react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession (context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}


const Page = ({
    providers,
  }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

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
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                        <Button onClick={() => signIn(provider.id)} 
                        variant="contained">
                            Sign in with {provider.name}
                        </Button>
                        </div>
                    ))}
                      <Button fullWidth size="large" sx={{ mt: 3 }} onClick={() => {}}>
                        -> Sign Up
                      </Button>
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
