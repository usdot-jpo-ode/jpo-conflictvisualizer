import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserManager, LocalStorageManager } from "../managers";
import { RootState } from "../store";
import Keycloak from "keycloak-js";
import getConfig from "next/config";
import userManagementApi from "../apis/user-management-api";

const { publicRuntimeConfig } = getConfig();

const parseJwt = (token: string | undefined): ParsedJWT | undefined => {
  if (!token) return undefined;
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch (err) {
    return undefined;
  }
};

const authToken = LocalStorageManager.getAuthToken();
let parsedAuthToken = parseJwt(authToken);
parsedAuthToken = UserManager.isLoginActive(parsedAuthToken) ? parsedAuthToken : undefined;

export const getUserEmailPreference = createAsyncThunk(
  "user/getUserEmailPreference",
  async (_, { getState }) => {
    const currentState = getState() as RootState;
    const token = selectAuthToken(currentState)!;
    return await userManagementApi.getUserEmailPreference({
      token: token,
    });
  },
  {
    condition: (_, { getState }) => selectAuthToken(getState() as RootState) != undefined,
  }
);

export const updateUserEmailPreference = createAsyncThunk(
  "user/updateUserEmailPreference",
  async (emailPreference: EmailPreferences, { getState, dispatch }) => {
    const currentState = getState() as RootState;
    const token = selectAuthToken(currentState);
    const email = selectEmail(currentState);

    const success = await userManagementApi.updateUserEmailPreference({
      token: token!,
      email: email!,
      preferences: emailPreference,
    });
    if (success) {
      dispatch(getUserEmailPreference());
    }
  },
  {
    condition: (_, { getState }) =>
      selectAuthToken(getState() as RootState) != undefined && selectEmail(getState() as RootState) != undefined,
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    value: {
      authToken: authToken as string | undefined,
      refreshToken: undefined as string | undefined,
      parsedJwt: parsedAuthToken as ParsedJWT | undefined,
      keycloakClient: undefined as Keycloak | undefined,
      email_preference: undefined as EmailPreferences | undefined,
    },
  },
  reducers: {
    logout: (state) => {
      state.value.authToken = undefined;
      state.value.parsedJwt = undefined;
      LocalStorageManager.removeAuthToken();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.value.authToken = action.payload;
      state.value.parsedJwt = parseJwt(action.payload);
      LocalStorageManager.setAuthToken(action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.value.refreshToken = action.payload;
    },
    initKeycloakClient: (state, action: PayloadAction<Keycloak>) => {
        state.value.keycloakClient = action.payload;
        state.value.keycloakClient.clientSecret = `${publicRuntimeConfig.KEYCLOAK_CLIENT_SECRET}`;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserEmailPreference.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserEmailPreference.fulfilled, (state, action: PayloadAction<EmailPreferences>) => {
        state.loading = false;
        state.value.email_preference = action.payload;
      })
      .addCase(getUserEmailPreference.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, setLoading, setToken, setRefreshToken, initKeycloakClient } = userSlice.actions;

export const selectKeycloakClient = (state: RootState) => state.user.value.keycloakClient;
export const selectAuthToken = (state: RootState) => state.user.value.authToken;
export const selectRefreshToken = (state: RootState) => state.user.value.refreshToken;
export const selectParsedJwt = (state: RootState) => state.user.value.parsedJwt;
export const selectRole = (state: RootState) =>
  (selectParsedJwt(state)?.resource_access?.["realm-management"]?.roles ?? []).includes("manage-users")
    ? "ADMIN"
    : "USER";
export const selectTokenExpiration = (state: RootState) => selectParsedJwt(state)?.exp;
export const selectFullName = (state: RootState) =>
  selectParsedJwt(state)?.given_name && selectParsedJwt(state)?.family_name
    ? selectParsedJwt(state)?.given_name + " " + selectParsedJwt(state)?.family_name
    : undefined;
export const selectFirstName = (state: RootState) => selectParsedJwt(state)?.given_name;
export const selectLastName = (state: RootState) => selectParsedJwt(state)?.family_name;
export const selectEmail = (state: RootState) => selectParsedJwt(state)?.preferred_username;
export const selectEmailPreference = (state: RootState) => state.user.value.email_preference;
export const selectUser = (state: RootState): User | undefined =>
  selectFirstName(state) &&
  selectLastName(state) &&
  selectEmail(state) &&
  selectRole(state) &&
  selectParsedJwt(state)?.sub &&
  selectEmailPreference(state)
    ? {
        first_name: selectFirstName(state)!,
        last_name: selectLastName(state)!,
        email: selectEmail(state)!,
        role: selectRole(state)!,
        id: selectParsedJwt(state)?.sub!,
        email_preference: selectEmailPreference(state)!,
      }
    : undefined;

export const selectLoading = (state: RootState) => state.user.loading;
export const selectLoadingGlobal = (state: RootState) => {
  let loading = false;
  for (const [key, value] of Object.entries(state)) {
    if (value.loading) {
      loading = true;
      break;
    }
  }
  return loading;
};

export default userSlice.reducer;
