import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Logo } from "../../../../../components/logo";
import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

const Page = () => {

    const router = useRouter();
    const { key } = router.query;
    
  const [emailSent, setEmailSent] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Username is required"),
      first_name: Yup.string(),
      last_name: Yup.string(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // TODO: Submit user creation request
        helpers.setSubmitting(false);
      } catch (err: any) {
        console.error(err);
        helpers.setFieldError("submit", err.message || "Something went wrong");
        helpers.setSubmitting(false);
      }
    },
  });

  const handleRetry = () => {
    setEmailSent(false);
  };

  const handleSkip = () => {
    // Since skip is requested, we set a fake user as authenticated
    const user = {};

    // Update Auth Context state
    // signIn();

    // Persist the skip for AuthProvider initialize call
    globalThis.sessionStorage.setItem("skip-auth", "true");

    // Redirect to home page
    Router.push("/").catch(console.error);
  };

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
                {emailSent ? (
                  <div>
                    <Typography sx={{ mb: 1 }} variant="h4">
                      Confirm your email
                    </Typography>
                    <Typography>
                      We emailed a magic link to&nbsp;
                      <Box
                        component="span"
                        sx={{
                          color: "primary.main",
                        }}
                      >
                        {formik.values.email}
                      </Box>
                      <br />
                      Click the link to to log in.
                    </Typography>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        gap: 3,
                        mt: 3,
                      }}
                    >
                      <Typography color="text.secondary" variant="body2">
                        Wrong email?
                      </Typography>
                      <Button color="inherit" onClick={handleRetry}>
                        Use a different email
                      </Button>
                    </Box>
                  </div>
                ) : (
                  <div>
                    <Typography sx={{ mb: 1 }} variant="h4">
                      Sign Up
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }} variant="body2">
                      CIMMS Cloud Management Console
                    </Typography>
                    <div>
                      <TextField
                        sx={{ mb: 3 }}
                        error={Boolean(formik.touched.email && formik.errors.email)}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        value={formik.values.email}
                        variant="outlined"
                      />
                      <TextField
                        sx={{ mb: 3 }}
                        error={Boolean(formik.touched.first_name && formik.errors.first_name)}
                        fullWidth
                        helperText={formik.touched.first_name && formik.errors.first_name}
                        label="First Name"
                        name="first_name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.first_name}
                        variant="outlined"
                      />
                      <TextField
                        error={Boolean(formik.touched.last_name && formik.errors.last_name)}
                        fullWidth
                        helperText={formik.touched.last_name && formik.errors.last_name}
                        label="Last Name"
                        name="last_name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.last_name}
                        variant="outlined"
                      />
                      {formik.errors.submit && (
                        <Typography color="error" sx={{ mt: 2 }} variant="body2">
                          {formik.errors.submit}
                        </Typography>
                      )}
                      <Button
                        fullWidth
                        size="large"
                        sx={{ mt: 3 }}
                        onClick={() => formik.handleSubmit()}
                        variant="contained"
                      >
                        Submit User Creation Request
                      </Button>
                      <Button fullWidth size="large" sx={{ mt: 3 }} onClick={handleSkip}>
                        -> Sign In
                      </Button>
                    </div>
                  </div>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Page;
