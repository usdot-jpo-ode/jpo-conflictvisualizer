import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardProvider } from "../contexts/dashboard-context";
import React from "react";
import MessageMonitorApi from "../apis/mm-api";
import { useDashboardContext } from "../contexts/dashboard-context";
import userManagementApi from "../apis/user-management-api";
import { useSelector, useDispatch } from "react-redux";
import {
  initKeycloakClient,
  selectAuthToken,
  selectEmail,
  selectFirstName,
  selectKeycloakClient,
  selectLastName,
  selectParsedJwt,
  selectRole,
  setRefreshToken,
  // Actions
  setToken,
} from "../slices/userSlice";
import dynamic from "next/dynamic";
import getConfig from "next/config";
import { AuthGuard } from "./auth-guard";
import Keycloak from "keycloak-js";
import { ReactKeycloakProvider } from "@react-keycloak/web";

const { publicRuntimeConfig } = getConfig();

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

const parseJwt = (token) => {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (err) {
    return { ERROR: err };
  }
};

export const DashboardLayout = (props) => {
  const dispatch = useDispatch();

  const authToken = useSelector(selectAuthToken);
  const role = useSelector(selectRole);
  const email = useSelector(selectEmail);
  const firstName = useSelector(selectFirstName);
  const lastName = useSelector(selectLastName);
  const parsedJwt = useSelector(selectParsedJwt);

  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [intersections, setIntersections] = useState<IntersectionReferenceData[]>([]);
  const { setIntersection, setUser } = useDashboardContext();

  const updateUser = async () => {
    if (authToken && role) {
      const user: User = {
        email: email!,
        first_name: firstName!,
        last_name: lastName!,
        id: parsedJwt?.sub!,
        role: role,
        email_preference: await userManagementApi.getUserEmailPreference({
          token: authToken,
        }),
      };
      setUser(user);
    } else {
      console.error("Did not attempt to update user. Access token:", Boolean(authToken), "Role:", role);
    }
  };

  useEffect(() => {
    updateUser();
    if (authToken) {
      MessageMonitorApi.getIntersections({ token: authToken }).then((intersections: IntersectionReferenceData[]) => {
        setIntersections(intersections);
        setIntersection(intersections?.[0]?.intersectionID);
      });
    } else {
      console.error("Did not attempt to update user automatically. Access token:", Boolean(authToken));
    }
  }, [authToken]);

  return (
    <DashboardProvider>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} intersections={intersections} />
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </DashboardProvider>
    // </AuthGuard>
  );
};

// export const DashboardLayout = dynamic(() => Promise.resolve(DashboardLayoutSSR), {
//   ssr: false,
// });
