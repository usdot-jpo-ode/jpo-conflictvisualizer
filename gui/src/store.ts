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

const tempState = setupStore({}).getState;

export type RootStateType = ReturnType<typeof tempState>;
