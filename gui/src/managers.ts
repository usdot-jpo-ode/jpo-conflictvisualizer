const AUTH_DATA_LOCAL_STORAGE_KEY = "authToken";

const LocalStorageManager = {
  getAuthToken: (): string | undefined => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_DATA_LOCAL_STORAGE_KEY) ?? "");
    } catch (e) {
      return undefined;
    }
  },
  setAuthToken: (authData) => {
    return localStorage.setItem(AUTH_DATA_LOCAL_STORAGE_KEY, JSON.stringify(authData));
  },
  removeAuthToken: () => {
    return localStorage.removeItem(AUTH_DATA_LOCAL_STORAGE_KEY);
  },
};

const UserManager = {
  isLoginActive: (token?: ParsedJWT) => {
    return token && Date.now() < token.exp * 1000;
  },
};

export { UserManager, LocalStorageManager };
