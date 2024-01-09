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
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";

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

const DashboardLayoutSSR = (props) => {
  const dispatch = useDispatch();

  const authToken = useSelector(selectAuthToken);
  const role = useSelector(selectRole);
  const email = useSelector(selectEmail);
  const firstName = useSelector(selectFirstName);
  const lastName = useSelector(selectLastName);
  const parsedJwt = useSelector(selectParsedJwt);
  const [keycloakClient, setKeycloakClient] = useState<Keycloak | undefined>(undefined);
  // const keycloakClient = useSelector(selectKeycloakClient);

  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [intersections, setIntersections] = useState<IntersectionReferenceData[]>([]);
  const { setIntersection, setUser } = useDashboardContext();
  let loginDispatched = false;

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

  const initKeycloakClientLocal = () => {
    if (!keycloakClient) {
      setKeycloakClient(
        new Keycloak({
          url: `${publicRuntimeConfig.AUTH_SERVER_URL}`,
          realm: `${publicRuntimeConfig.KEYCLOAK_REALM}`,
          clientId: `${publicRuntimeConfig.KEYCLOAK_CLIENT_ID}`,
          //   clientSecret: `${publicRuntimeConfig.KEYCLOAK_CLIENT_SECRET}`,
        })
      );
    }
  };

  useEffect(() => {
    updateUser();
    if (authToken) {
      MessageMonitorApi.getIntersections({ token: authToken }).then((intersections: IntersectionReferenceData[]) => {
        intersections.push({
          intersectionID: -1,
          roadRegulatorID: -1,
          rsuIP: "0.0.0.0",
          latitude: 0,
          longitude: 0,
        });
        setIntersections(intersections);
        setIntersection(intersections?.[0]?.intersectionID);
      });
    } else {
      console.error("Did not attempt to update user automatically. Access token:", Boolean(authToken));
    }
  }, [authToken]);

  useEffect(() => {
    // dispatch(initKeycloakClient());
    setTimeout(initKeycloakClientLocal, 5000);
    initKeycloakClientLocal();
  }, []);

  useEffect(() => {
    console.log("keycloakClient:", keycloakClient);
    if (keycloakClient) {
      keycloakClient
        .updateToken(300)
        .then(function (refreshed) {
          if (refreshed) {
            console.debug("Token was successfully refreshed");
          } else {
            console.debug("Token is still valid");
          }
        })
        .catch((e) => console.error("Failed to refresh the token, or the session has expired", e));

      // keycloakClient
      //   .loadUserInfo()
      //   .then((userInfo) => {
      //     console.log("userInfo:", userInfo);
      //   })
      //   .catch((e) => console.error("Failed to load user info", e));
    }
  }, [keycloakClient]);

  return (
    // <AuthGuard>
    keycloakClient ? (
      <ReactKeycloakProvider
        initOptions={{ onLoad: "login-required" }}
        authClient={keycloakClient}
        onEvent={(event, error) => {
          console.log("onEvent", event, error);
        }}
        onTokens={({ token, refreshToken }) => {
          console.debug("Tokens Generated");
          // Logic to prevent multiple login triggers
          if (!loginDispatched && token && refreshToken) {
            console.debug("onTokens loginDispatched:");
            dispatch(setToken(token));
            dispatch(setRefreshToken(refreshToken));
            loginDispatched = true;
          }
          setTimeout(() => (loginDispatched = false), 5000);
        }}
      >
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
      </ReactKeycloakProvider>
    ) : (
      <Typography>Keycloak Client Not Initialized</Typography>
    )
    // </AuthGuard>
  );
};

export const DashboardLayout = dynamic(() => Promise.resolve(DashboardLayoutSSR), {
  ssr: false,
});
