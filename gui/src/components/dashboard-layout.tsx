import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthGuard } from "./auth-guard";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardProvider } from "../contexts/dashboard-context";
import React from "react";
import MessageMonitorApi from "../apis/mm-api";
import { useDashboardContext } from "../contexts/dashboard-context";
import { useSession } from "next-auth/react";
import keycloakApi from "../apis/keycloak-api";
import userManagementApi from "../apis/user-management-api";
import { useSelector, useDispatch } from "react-redux";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak-config";
import {
  // Actions
  setToken,
} from "../slices/userSlice";

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

  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [intersections, setIntersections] = useState<IntersectionReferenceData[]>([]);
  const { setIntersection, setUser } = useDashboardContext();
  const { data: session } = useSession();
  let loginDispatched = false;

  const updateUser = async () => {
    if (session?.accessToken && session?.role) {
      const parsedJwt = parseJwt(session?.accessToken);
      const user: User = {
        email: parsedJwt?.preferred_username,
        first_name: parsedJwt?.given_name,
        last_name: parsedJwt?.family_name,
        id: parsedJwt?.sub,
        role: session?.role,
        email_preference: await userManagementApi.getUserEmailPreference({
          token: session?.accessToken,
        }),
      };
      setUser(user);
    } else {
      console.error(
        "Did not attempt to update user. Access token:",
        Boolean(session?.accessToken),
        "Role:",
        session?.role
      );
    }
  };

  useEffect(() => {
    updateUser();
    if (session?.accessToken) {
      MessageMonitorApi.getIntersections({ token: session?.accessToken }).then(
        (intersections: IntersectionReferenceData[]) => {
          intersections.push({
            intersectionID: -1,
            roadRegulatorID: -1,
            rsuIP: "0.0.0.0",
            latitude: 0,
            longitude: 0,
          });
          setIntersections(intersections);
          setIntersection(intersections?.[0]?.intersectionID);
        }
      );
    } else {
      console.error("Did not attempt to update user automatically. Access token:", Boolean(session?.accessToken));
    }
  }, [session?.accessToken]);

  useEffect(() => {
    keycloak
      .updateToken(300)
      .then(function (refreshed) {
        if (refreshed) {
          console.debug("Token was successfully refreshed");
        } else {
          console.debug("Token is still valid");
        }
      })
      .catch(function () {
        // dispatch(setKcFailure(true))
        console.error("Failed to refresh the token, or the session has expired");
      });
  }, []);

  return (
    <ReactKeycloakProvider
      initOptions={{ onLoad: "login-required" }}
      authClient={keycloak}
      onTokens={({ token }) => {
        // Logic to prevent multiple login triggers
        if (!loginDispatched && token) {
          console.debug("onTokens loginDispatched:");
          dispatch(setToken(token));
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
  );
};
