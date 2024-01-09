import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
  });
};

export type RootState = ReturnType<ReturnType<typeof setupStore>["getState"]>;
