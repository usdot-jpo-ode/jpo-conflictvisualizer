import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { auth, ENABLE_AUTH } from "../lib/auth";
import React from "react";

interface DashboardContextType {
  intersectionId?: number;
  roadRegulatorId?: number;
  user?: User;
  setIntersection: (intersectionId?: number) => void;
  setRoadRegulator: (intersectionId: number, roadRegulatorId: number) => void;
  setUser: (user: User) => void;
}

const HANDLERS = {
  SET_INTERSECTION: "SET_INTERSECTION",
  SET_ROAD_REGULATOR: "SET_ROAD_REGULATOR",
  SET_USER: "SET_USER",
};

const initialState = {
  intersectionId: 12109,
  roadRegulatorId: -1,
  user: undefined,
  setIntersection: () => {},
  setRoadRegulator: () => {},
  setUser: () => {},
};

const handlers = {
  [HANDLERS.SET_INTERSECTION]: (state, action) => {
    const intersectionId = action.payload;

    return {
      ...state,
      intersectionId,
    };
  },
  [HANDLERS.SET_ROAD_REGULATOR]: (state, action) => {
    const roadRegulatorId = action.payload.roadRegulatorId;
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

  const setIntersection = (intersectionId: number) => {
    dispatch({
      type: HANDLERS.SET_INTERSECTION,
      payload: intersectionId,
    });
  };

  const setRoadRegulator = (roadRegulatorId: number, intersectionId: number) => {
    dispatch({
      type: HANDLERS.SET_ROAD_REGULATOR,
      payload: { roadRegulatorId, intersectionId },
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
        setRoadRegulator,
        setUser,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node,
};

export const DashboardConsumer = DashboardContext.Consumer;

export const useDashboardContext = () => useContext<DashboardContextType>(DashboardContext);
