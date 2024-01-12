import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import mapReducer from "./components/map/map-slice";
import mapLayerStyleReducer from "./components/map/map-layer-style-slice";

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      user: userReducer,
      map: mapReducer,
      mapLayerStyle: mapLayerStyleReducer,
    },
    preloadedState,
  });
};

export type RootState = ReturnType<ReturnType<typeof setupStore>["getState"]>;
