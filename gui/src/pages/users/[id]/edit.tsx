import { useState, useCallback, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import keycloakApi from "../../../apis/keycloak-api";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { UserEditForm } from "../../../components/users/user-edit-form";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken } from "../../../slices/userSlice";

const UserEdit = () => {
  const dispatch = useDispatch();

  const authToken = useSelector(selectAuthToken);

  const [user, setUser] = useState<User | undefined>(undefined);

  const router = useRouter();
  const { id } = router.query;

  const getUser = async (userId: string) => {
    try {
      if (authToken) {
        const data = await keycloakApi.getUserInfo({ token: authToken, id: userId });

        if (data) setUser(data);
      } else {
        console.error("Did not attempt to get user info. Access token:", Boolean(authToken));
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
