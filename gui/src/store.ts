import { Action, ThunkAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer, { userSlice } from "./slices/userSlice";
import mapReducer, { mapSlice } from "./components/map/map-slice";
import mapLayerStyleReducer, { mapLayerStyleSlice } from "./components/map/map-layer-style-slice";
import { MakeStore, createWrapper } from "next-redux-wrapper";

export const makeStore = (preloadedState) => {
  console.log("SETTING UP STORE");
  return configureStore({
    reducer: {
      user: userReducer,
      map: mapReducer,
      mapLayerStyle: mapLayerStyleReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
};

const reducers = {
  [userSlice.name]: userSlice.reducer,
  [mapSlice.name]: mapSlice.reducer,
  [mapLayerStyleSlice.name]: mapLayerStyleSlice.reducer,
};

type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });

export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
