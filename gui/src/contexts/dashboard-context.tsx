import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { auth, ENABLE_AUTH } from "../lib/auth";
import React from "react";

type DashboardContextType = {
  intersectionId: number;
  roadRegulatorId: number;
};

const HANDLERS = {
  SET_INTERSECTION: "SET_INTERSECTION",
  SET_ROAD_REGULATOR: "SET_ROAD_REGULATOR",
};

const initialState = {
  intersectionId: 12109,
  roadRegulatorId: -1,
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
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

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

  return (
    <DashboardContext.Provider
      value={{
        ...state,
        setIntersection,
        setRoadRegulator,
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
