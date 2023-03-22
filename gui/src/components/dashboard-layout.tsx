import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthGuard } from "./auth-guard";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardProvider, useDashboardContext } from "../contexts/dashboard-context";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import MessageMonitorApi from "../apis/mm-api";
import EventsApi from "../apis/events-api";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [intersections, setIntersections] = useState<IntersectionReferenceData[]>([]);

  useEffect(() => {
    MessageMonitorApi.getIntersections({ token: "token" }).then((intersections) =>
      setIntersections(intersections)
    );
  }, []);

  return (
    <AuthGuard>
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
    </AuthGuard>
  );
};
