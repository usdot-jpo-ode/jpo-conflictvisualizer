import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
  Theme,
  Chip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog as CogIcon } from "../icons/cog";
import { Lock as LockIcon } from "../icons/lock";
import { Selector as SelectorIcon } from "../icons/selector";
import { ShoppingBag as ShoppingBagIcon } from "../icons/shopping-bag";
import { User as UserIcon } from "../icons/user";
import { UserAdd as UserAddIcon } from "../icons/user-add";
import { Users as UsersIcon } from "../icons/users";
import MapIcon from "@mui/icons-material/Map";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";
import React from "react";
import { DashboardSidebarSection } from "./dashboard-sidebar-section";
import { useDashboardContext } from "../contexts/dashboard-context";

const generalItems = [
  {
    path: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    path: "/notifications",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Notifications",
  },
  //   {
  //     path: "/performanceReports",
  //     icon: <ChartBarIcon fontSize="small" />,
  //     title: "Performance Reports",
  //   },
  {
    path: "/map",
    icon: <MapIcon fontSize="small" />,
    title: "Map",
  },
  {
    path: "/data-selector",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Data Selector",
  },
  //   {
  //     path: "/users",
  //     icon: <UsersIcon fontSize="small" />,
  //     title: "Users",
  //   },
  {
    path: "/configuration",
    icon: <CogIcon fontSize="small" />,
    title: "Configuration",
  },
  {
    path: "/settings",
    icon: <CogIcon fontSize="small" />,
    title: "Settings",
  },
];

const adminItems = [];

const sections = [
  {
    title: "General",
    items: generalItems,
  },
  //   {
  //     title: "Admin",
  //     items: adminItems,
  //   },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
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
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {sections.map((section) => (
            <DashboardSidebarSection
              key={section.title}
              path={router.asPath}
              sx={{
                mt: 2,
                "& + &": {
                  mt: 2,
                },
              }}
              {...section}
            />
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
