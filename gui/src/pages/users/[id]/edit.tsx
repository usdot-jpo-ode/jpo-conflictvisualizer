import { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import keycloakApi from "../../../apis/keycloak-api";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { UserEditForm } from "../../../components/users/user-edit-form";
import { useSession } from "next-auth/react";

const UserEdit = () => {
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();

  const router = useRouter();
  const { id } = router.query;

  const getUser = async (userId: string) => {
    try {
      if (session?.accessToken) {
        const data = await keycloakApi.getUserInfo({ token: session?.accessToken, id: userId });
        console.log(data);

        setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser(id as string);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Edit User</title>
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
                {user?.email}
              </Typography>
            </div>
          </Box>
          <Box mt={3}>
            <UserEditForm user={user} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

UserEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UserEdit;
