import { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  AppBar,
  Avatar,
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
import MapIconRounded from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountPopover } from "./account-popover";
import React from "react";
import { getInitials } from "../utils/get-initials";
import { useDashboardContext } from "../contexts/dashboard-context";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import MapDialog from "./intersection-selector/intersection-selector-dialog";

const DashboardNavbarRoot = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

interface Props {
  onSidebarOpen: () => void;
  intersections: (IntersectionReferenceData | undefined)[];
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
    children: `${!name ? "" : name.split(" ")[0][0]}${!name ? "" : name.split(" ")[1]?.[0] ?? ""}`,
  };
}

export const DashboardNavbar = (props: Props) => {
  const { onSidebarOpen, intersections, ...other } = props;
  const settingsRef = useRef(null);
  const { intersectionId, setIntersection } = useDashboardContext();
  const [openAccountPopover, setOpenAccountPopover] = useState(false);
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const { data: session } = useSession();
  const theme = useTheme();

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
        theme={theme}
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
                label="IntersectionId"
                onChange={(e) => {
                  setIntersection(
                    e.target.value as number | undefined,
                    intersections.find((v) => v?.intersectionID == e.target.value)?.roadRegulatorID
                  );
                }}
              >
                {intersections.map((intersection) => {
                  return (
                    <MenuItem value={intersection?.intersectionID} key={intersection?.intersectionID}>
                      {intersection?.intersectionID == -1 ? "No Intersection" : intersection?.intersectionID}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Tooltip>
          <Tooltip title="Select Intersection on Map">
            <IconButton
              onClick={() => {
                setOpenMapDialog(true);
              }}
            >
              <MapIconRounded fontSize="large" />
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />
          <Avatar
            onClick={() => setOpenAccountPopover(true)}
            ref={settingsRef}
            {...stringAvatar(session?.user?.name ?? undefined)}
          >
            {getInitials(session?.user?.name ?? undefined)}
          </Avatar>
        </Toolbar>
      </DashboardNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      />
      <MapDialog
        open={openMapDialog}
        onClose={() => {
          setOpenMapDialog(false);
        }}
        intersections={intersections.filter((v) => v?.intersectionID != undefined) as IntersectionReferenceData[]}
      />
    </>
  );
};

DashboardNavbar.propTypes = {};
