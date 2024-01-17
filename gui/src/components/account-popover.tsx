import Router from "next/router";
import PropTypes from "prop-types";
import { Box, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import React from "react";
import getConfig from "next/config";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken, selectFirstName, selectKeycloakClient, selectRefreshToken } from "../slices/userSlice";
const { publicRuntimeConfig } = getConfig();

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const dispatch = useDispatch();

  const authToken = useSelector(selectAuthToken);
  const firstName = useSelector(selectFirstName);
  const refreshToken = useSelector(selectRefreshToken);
  const keycloakClient = useSelector(selectKeycloakClient);

  const handleSignOut = async () => {
    onClose?.();

    try {
      console.info("Signing out");
      keycloakClient?.logout();

      // if (authToken && refreshToken) {
      //   keycloakApi.logout({
      //     token: authToken,
      //     refresh_token: refreshToken,
      //   });
      // } else {
      //   console.error("Did not attempt to logout. Access token:", authToken, "Refresh Token:", refreshToken);
      // }
      // This can be call inside AuthProvider component, but we do it here for simplicity
      // signOut();

      // Redirect to sign-in page
      Router.push("/auth/signin").catch(console.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: "300px" },
      }}
      {...other}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          {firstName}
        </Typography>
      </Box>
      <MenuList
        disablePadding
        sx={{
          "& > *": {
            "&:first-of-type": {
              borderTopColor: "divider",
              borderTopStyle: "solid",
              borderTopWidth: "1px",
            },
            padding: "12px 16px",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            window.open(
              `${publicRuntimeConfig.AUTH_SERVER_URL}/realms/${publicRuntimeConfig.KEYCLOAK_REALM}/account/#/`
            );
          }}
        >
          Edit Account
        </MenuItem>
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
