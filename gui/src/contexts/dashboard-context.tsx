import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { auth, ENABLE_AUTH } from "../lib/auth";
import React from "react";
import { QueryProvider } from "./query-context";

interface DashboardContextType {
  intersectionId: number;
  roadRegulatorId: number;
  user?: User;
  setIntersection: (intersectionId?: number, roadRegulatorId?: number) => void;
  setUser: (user: User) => void;
}

const HANDLERS = {
  SET_INTERSECTION: "SET_INTERSECTION",
  SET_ROAD_REGULATOR: "SET_ROAD_REGULATOR",
  SET_USER: "SET_USER",
  SET_QUERY_RESULTS: "SET_QUERY_RESULTS",
};

const initialState = {
  intersectionId: -1,
  roadRegulatorId: -1,
  user: undefined,
  setIntersection: () => {},
  setUser: () => {},
};

const handlers = {
  [HANDLERS.SET_INTERSECTION]: (state, action) => {
    const intersectionId = action.payload.intersectionId;

    return {
      ...state,
      intersectionId,
    };
  },
  [HANDLERS.SET_ROAD_REGULATOR]: (state, action) => {
    const roadRegulatorId = action.payload.roadRegulatorId ?? -1;
    const intersectionId = action.payload.intersectionId;

    return {
      ...state,
      roadRegulatorId,
      intersectionId,
    };
  },
  [HANDLERS.SET_USER]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

// The role of this context is to propagate authentication state through the App tree.

export const DashboardContext = createContext<DashboardContextType>(initialState);

export const DashboardProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const setIntersection = (intersectionId: number, roadRegulatorId: number) => {
    dispatch({
      type: HANDLERS.SET_INTERSECTION,
      payload: { intersectionId: intersectionId, roadRegulatorId: roadRegulatorId ?? -1 },
    });
  };

  const setUser = (user: User) => {
    dispatch({
      type: HANDLERS.SET_USER,
      payload: { user },
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        setIntersection,
        setUser,
      }}
    >
      <QueryProvider>{children}</QueryProvider>
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node,
};

export const DashboardConsumer = DashboardContext.Consumer;

export const useDashboardContext = () => useContext<DashboardContextType>(DashboardContext);
