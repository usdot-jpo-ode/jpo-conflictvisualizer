import Head from "next/head";
import { Box, Typography, Container } from "@mui/material";
import React from "react";
import { UserCreateForm } from "../../../components/users/user-create-form";

const Page = () => {
  const user: User = {
    email: "",
    first_name: "",
    last_name: "",
    role: "USER",
    id: "",
    email_preference: {
      receiveAnnouncements: true,
      notificationFrequency: "ONCE_PER_DAY",
      receiveCeaseBroadcastRecommendations: true,
      receiveCriticalErrorMessages: true,
      receiveNewUserRequests: false,
    },
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
