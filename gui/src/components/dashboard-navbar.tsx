import { useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Theme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { Bell as BellIcon } from "../icons/bell";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { Users as UsersIcon } from "../icons/users";
import { AccountPopover } from "./account-popover";
import React from "react";
import { useSession } from "next-auth/react";
import { getInitials } from "../utils/get-initials";
import { useDashboardContext } from "../contexts/dashboard-context";

const DashboardNavbarRoot = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

interface Props {
  onSidebarOpen: () => void;
  intersections: IntersectionReferenceData[];
}

function stringToColor(string?: string) {
  if (!string) {
    return "#4d4d4d";
  }
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name?: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      //   cursor: "pointer",
      height: 40,
      width: 40,
      ml: 1,
    },
    children: `${!name ? "" : name.split(" ")[0][0]}${!name ? "" : name.split(" ")[1][0]}`,
  };
}

export const DashboardNavbar = (props: Props) => {
  const { onSidebarOpen, intersections, ...other } = props;
  const settingsRef = useRef(null);
  const dashboardContext = useDashboardContext();
  const { intersectionId, roadRegulatorId } = useDashboardContext();
  const [openAccountPopover, setOpenAccountPopover] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Select Intersection">
            <FormControl sx={{ width: 400, ml: 1, mt: 1 }} variant="filled">
              <InputLabel id="demo-simple-select-label">Intersection ID</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={intersectionId}
                label="Age"
                onChange={(e) => dashboardContext.setIntersection(e.target.value as number)}
              >
                {intersections.map((intersection) => {
                  return (
                    <MenuItem value={intersection.intersectionID}>
                      {intersection.intersectionID}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Avatar
            onClick={() => setOpenAccountPopover(true)}
            ref={settingsRef}
            {...stringAvatar("Jacob Frye" ?? "")}
          >
            {getInitials("Jacob Frye" ?? "")}
          </Avatar>
        </Toolbar>
      </DashboardNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      />
    </>
  );
};

DashboardNavbar.propTypes = {};
