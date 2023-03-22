import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import NextLink from "next/link";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Logo } from "../../components/logo";
import { ENABLE_AUTH } from "../../lib/auth";
// import { useSession, signIn, signOut } from "next-auth/react"
import React from "react";

const parseUrl = () => {
  // Get the token from the page URL hash (without #)
  const hash = window.location.hash.substring(1);
  const token = hash.split("=")[1];

  return { token };
};

const Page = () => {
  const confirmed = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  //   const { data: session } = useSession();

  const confirm = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (confirmed.current) {
      return;
    }

    confirmed.current = true;

    // Check if authentication with Zalter is enabled
    if (!ENABLE_AUTH) {
      setError("Zalter authentication not enabled");
      setIsLoading(false);
      return;
    }

    // Extract the token from the page URL
    const { token } = parseUrl();

    // Token missing, redirect to home
    if (!token) {
      Router.push("/").catch(console.error);
      return;
    }

    try {
      // This can be call inside AuthProvider component, but we do it here for simplicity
      //   await auth!.signInWithLink('finalize', { token });

      // Update Auth Context state
      // signIn();

      // Redirect to home page
      Router.push("/").catch(console.error);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    confirm().catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box sx={{ p: 3 }}>
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
        <Typography sx={{ mb: 1 }} variant="h4">
          Oops!
        </Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  return null;
};

export default Page;
