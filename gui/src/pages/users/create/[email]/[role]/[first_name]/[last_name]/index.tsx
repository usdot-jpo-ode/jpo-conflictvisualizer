import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Typography, Container } from "@mui/material";
import React from "react";
import { UserCreateForm } from "../../../../../../../components/users/user-create-form";

const Page = () => {
  const router = useRouter();
  const { email, role, first_name, last_name } = router.query;

  const user: User = {
    email: email as string,
    first_name: first_name == "undefined" ? "" : (first_name as string),
    last_name: last_name == "undefined" ? "" : (last_name as string),
    role: role == "admin" ? "admin" : "user",
    id: "",
  };

  return (
    <>
      <Head>
        <title>Create User</title>
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
                New User
              </Typography>
            </div>
          </Box>
          <Box mt={3}>
            <UserCreateForm user={user} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
