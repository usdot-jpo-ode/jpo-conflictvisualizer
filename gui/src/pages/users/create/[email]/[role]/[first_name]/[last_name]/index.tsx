import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Grid, TextField, Typography, Select, MenuItem } from "@mui/material";
import { Logo } from "../../../../../../../components/logo";
import { useSession } from "next-auth/react";
import React from "react";
import keycloakApi from "../../../../../../../apis/keycloak-api";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { email, role, first_name, last_name } = router.query;

  const formik = useFormik({
    initialValues: {
      email: email,
      first_name: first_name,
      last_name: last_name,
      role: role,
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Username is required"),
      first_name: Yup.string(),
      last_name: Yup.string(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        keycloakApi.createUser({
          token: session?.accessToken,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          role: values.role,
        });
      } catch (err: any) {
        console.error(err);
        helpers.setFieldError("submit", err.message || "Something went wrong");
        helpers.setSubmitting(false);
      }
    },
  });

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
                    Create User
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
                    <Grid item md={12} xs={12}>
                      <Typography>Role</Typography>
                      <Select
                        value={formik.values.role}
                        label="Role"
                        name="role"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"user"}>User</MenuItem>
                      </Select>
                    </Grid>
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
