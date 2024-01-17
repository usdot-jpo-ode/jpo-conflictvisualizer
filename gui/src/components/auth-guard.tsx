import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import keycloakApi from "../apis/keycloak-api";
import Router from "next/router";
import { initKeycloakClient, selectAuthToken, selectKeycloakClient } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

export const AuthGuard = (props) => {
  const { children } = props;
  const dispatch = useDispatch();
  const authToken = useSelector(selectAuthToken);
  const keycloakClient = useSelector(selectKeycloakClient);

  const [checked, setChecked] = useState(false);

  const validateSession = async (authToken: string | undefined) => {
    try {
      if (!authToken) {
        return false;
      }
      const result = await keycloakApi.validateToken({ token: authToken });
      return result;
    } catch (err) {
      console.error("Failed to validate token", err);
      return false;
    }
  };

  // useEffect(() => {
  //   dispatch(initKeycloakClient());
  // }, []);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.
  useEffect(() => {
    if (!validateSession(authToken)) {
      console.debug("Forcing Sign In");
      Router.push("/auth/signin").catch(console.error);
      setChecked(true);
    } else {
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
      setChecked(true);
    }
  }, [keycloakClient]);

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
