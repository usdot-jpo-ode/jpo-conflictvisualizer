import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserManager, LocalStorageManager } from "../managers";
import { RootStateType } from "../store";

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

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    value: {
      authToken: authToken as string | undefined,
      parsedJwt: parsedAuthToken as ParsedJWT | undefined,
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
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const { logout, setLoading, setToken } = userSlice.actions;

export const selectToken = (state: RootStateType) => state.user.value.authToken;
export const selectParsedJwt = (state: RootStateType) => state.user.value.parsedJwt;
export const selectRole = (state: RootStateType) =>
  (state.user.value.parsedJwt?.resource_access?.["realm-management"]?.roles ?? []).includes("manage-users")
    ? "ADMIN"
    : "USER";
export const selectTokenExpiration = (state: RootStateType) => state.user.value.parsedJwt?.exp;
export const selectFirstName = (state: RootStateType) => state.user.value.parsedJwt?.given_name;
export const selectLastName = (state: RootStateType) => state.user.value.parsedJwt?.family_name;
export const selectEmail = (state: RootStateType) => state.user.value.parsedJwt?.preferred_username;
export const selectLoading = (state: RootStateType) => state.user.loading;
export const selectLoadingGlobal = (state: RootStateType) => {
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
