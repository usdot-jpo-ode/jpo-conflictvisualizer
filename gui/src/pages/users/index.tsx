import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import { Refresh as RefreshIcon } from "../../icons/refresh";
import { Search as SearchIcon } from "../../icons/search";
import keycloakApi from "../../apis/keycloak-api";
import userCreationRequestApi from "../../apis/user-api-management";
import { useSession } from "next-auth/react";
import { UserListTable } from "../../components/users/user-list-table";
import { UserCreationRequestListTable } from "../../components/users/user-creation-request-list-table";
import NextLink from "next/link";
import { Plus as PlusIcon } from "../../icons/plus";
import toast, { Toaster } from "react-hot-toast";

const tabs = [
  {
    label: "All",
    value: "all",
    description: "All users",
  },
  {
    label: "Admin",
    value: "ADMIN",
    description: "Administrators, with additional editing permissions",
  },
  {
    label: "User",
    value: "USER",
    description: "Users with basic viewing permissions",
  },
];

const applyFilters = (users, filter) =>
  users.filter((user) => {
    if (filter.query) {
      let queryMatched = false;
      const properties = ["email", "first_name", "last_name"];
      properties.forEach((property) => {
        if (user[property]?.toLowerCase().includes(filter.query.toLowerCase())) {
          queryMatched = true;
        }
      });

      if (!queryMatched) {
        return false;
      }
    }

    if (filter.tab === "all") {
      return true;
    } else {
      return user["role"] == filter.tab;
    }
  });

const applyPagination = (users, page, rowsPerPage) => users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const Page = () => {
  const queryRef = useRef<TextFieldProps>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userCreationRequests, setUserCreationRequests] = useState<User[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentDescription, setCurrentDescription] = useState("");
  const [filter, setFilter] = useState({
    query: "",
    tab: currentTab,
  });
  const { data: session } = useSession();

  useEffect(() => {
    updateDescription();
  }, [currentTab]);

  const getUsers = async () => {
    try {
      if (session?.accessToken) {
        // const data = await keycloakApi.getToken({ username: "cm_admin", password: "12345" });
        const data = await keycloakApi.getUsersList({ token: session?.accessToken });
        console.log("RECEIVED DATA: ", data);

        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUserCreationRequests = async () => {
    try {
      if (session?.accessToken) {
        // const data = await keycloakApi.getToken({ username: "cm_admin", password: "12345" });
        const data = await userCreationRequestApi.getUserCreationRequests({ token: session?.accessToken });
        console.log("RECEIVED DATA: ", data);

        setUserCreationRequests(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
    getUserCreationRequests();
  }, []);

  const handleTabsChange = (event, value) => {
    const updatedFilter = { ...filter, tab: value };
    setCurrentTab(value);
    setFilter(updatedFilter);
    setPage(0);
    setCurrentTab(value);
  };

  const handleQueryChange = (event) => {
    event.preventDefault();
    setFilter((prevState) => ({
      ...prevState,
      query: queryRef.current?.value as string,
    }));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const updateDescription = () => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].value === currentTab) {
        setCurrentDescription(tabs[i].description);
      }
    }
  };

  // Usually query is done on backend with indexing solutions
  const filteredParameters = applyFilters(users, filter);
  const paginatedParameters = applyPagination(filteredParameters, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mb: 4 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">Users</Typography>
              </Grid>
              <Grid item>
                <NextLink href={"/users/create"} passHref>
                  <Button startIcon={<PlusIcon fontSize="small" />} variant="contained">
                    Add
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              m: -1,
              mt: 3,
              mb: 3,
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                getUsers();
                getUserCreationRequests();
              }}
              startIcon={<RefreshIcon fontSize="small" />}
              sx={{ m: 1 }}
            >
              Refresh
            </Button>
          </Box>
          <Card>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              sx={{ px: 3 }}
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
            <Divider />
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                m: -1.5,
                p: 3,
              }}
            >
              <Stack>
                <Box
                  component="form"
                  onSubmit={handleQueryChange}
                  sx={{
                    flexGrow: 1,
                    m: 1.5,
                  }}
                >
                  <TextField
                    defaultValue=""
                    fullWidth
                    inputProps={{ ref: queryRef }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Search users"
                  />
                </Box>
                <Typography variant="body1">{currentDescription}</Typography>
              </Stack>
            </Box>

            <UserListTable
              users={paginatedParameters}
              parametersCount={filteredParameters.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
            />
          </Card>
        </Container>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mb: 4 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">Pending User Creation Requests</Typography>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              m: -1,
              mt: 3,
              mb: 3,
            }}
          ></Box>
          <Card>
            <UserCreationRequestListTable
              users={userCreationRequests}
              parametersCount={filteredParameters.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
