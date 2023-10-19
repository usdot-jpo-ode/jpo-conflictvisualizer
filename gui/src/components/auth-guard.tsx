import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSession, signIn, signOut } from "next-auth/react";
import keycloakApi from "../apis/keycloak-api";
import { Session } from "next-auth";

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { data: session, status } = useSession();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  const loading = status === "loading";

  const validateSession = async (session: Session | null) => {
    const result = await keycloakApi.validateToken({ token: session?.accessToken });
    return result;
  };

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!validateSession(session)) {
      console.debug("Forcing Sign In", session);
      signIn();
      setChecked(true);
    } else {
      console.debug("SESSION", session);
      setChecked(true);
    }
  }, [status]);

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
