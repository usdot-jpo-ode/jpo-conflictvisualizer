import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { auth, ENABLE_AUTH } from "../lib/auth";
import React from "react";
import dayjs from "dayjs";

interface Item {
  label: string;
  value: string;
}

interface DataSelectorFormType {
  type: string;
  startDate: Date;
  timeRange: number;
  timeUnit: dayjs.ManipulateType;
  intersectionId: number | undefined;
  roadRegulatorId: number;
  submit: boolean | null;

  // type specific filters
  bsmVehicleId: number | null;
  eventTypes: Item[];
  assessmentTypes: Item[];
}

interface QueryContextType {
  type: string;
  events: MessageMonitor.Event[];
  assessments: Assessment[];
  graphData: Array<GraphArrayDataType>;
  openMapDialog: boolean;
  roadRegulatorIntersectionIds: { [roadRegulatorId: number]: number[] };
  dataSelectorForm: DataSelectorFormType;

  setType: (type: string) => void;
  setEvents: (events: MessageMonitor.Event[]) => void;
  setAssessments: (assessments: Assessment[]) => void;
  setGraphData: (graphData: Array<GraphArrayDataType>) => void;
  setOpenMapDialog: (openMapDialog: boolean) => void;
  setRoadRegulatorIntersectionIds: (roadRegulatorIntersectionIds: { [roadRegulatorId: number]: number[] }) => void;
  setDataSelectorForm: (form: DataSelectorFormType) => void;
}

const HANDLERS = {
  SET_TYPE: "SET_TYPE",
  SET_EVENTS: "SET_EVENTS",
  SET_ASSESSMENTS: "SET_ASSESSMENTS",
  SET_GRAPH_DATA: "SET_GRAPH_DATA",
  SET_OPEN_MAP_DIALOG: "SET_OPEN_MAP_DIALOG",
  SET_ROAD_REGULATOR_INTERSECTION_IDS: "SET_ROAD_REGULATOR_INTERSECTION_IDS",
  SET_DATA_SELECTOR_FORM: "SET_DATA_SELECTOR_FORM",
};

const initialState = {
  type: "",
  events: [],
  assessments: [],
  graphData: [],
  openMapDialog: false,
  roadRegulatorIntersectionIds: {},
  dataSelectorForm: {
    type: "events",
    startDate: new Date(),
    timeRange: 0,
    timeUnit: "minutes" as dayjs.ManipulateType,
    intersectionId: undefined,
    roadRegulatorId: -1,
    submit: null,

    // type specific filters
    bsmVehicleId: null,
    eventTypes: [] as Item[],
    assessmentTypes: [] as Item[],
  },

  setType: () => {},
  setEvents: () => {},
  setAssessments: () => {},
  setGraphData: () => {},
  setOpenMapDialog: () => {},
  setRoadRegulatorIntersectionIds: () => {},
  setDataSelectorForm: () => {},
};

const handlers = {
  [HANDLERS.SET_TYPE]: (state, action) => {
    const type = action.payload.type;

    return {
      ...state,
      type,
    };
  },
  [HANDLERS.SET_EVENTS]: (state, action) => {
    const events = action.payload.events;

    return {
      ...state,
      events,
    };
  },
  [HANDLERS.SET_ASSESSMENTS]: (state, action) => {
    const assessments = action.payload.assessments;

    return {
      ...state,
      assessments,
    };
  },
  [HANDLERS.SET_GRAPH_DATA]: (state, action) => {
    const graphData = action.payload.graphData;

    return {
      ...state,
      graphData,
    };
  },
  [HANDLERS.SET_OPEN_MAP_DIALOG]: (state, action) => {
    const openMapDialog = action.payload.openMapDialog;

    return {
      ...state,
      openMapDialog,
    };
  },
  [HANDLERS.SET_ROAD_REGULATOR_INTERSECTION_IDS]: (state, action) => {
    const roadRegulatorIntersectionIds = action.payload.roadRegulatorIntersectionIds;

    return {
      ...state,
      roadRegulatorIntersectionIds,
    };
  },
  [HANDLERS.SET_DATA_SELECTOR_FORM]: (state, action) => {
    const form = action.payload.form;

    return {
      ...state,
      dataSelectorForm: form,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

// The role of this context is to propagate authentication state through the App tree.

export const QueryContext = createContext<QueryContextType>(initialState);

export const QueryProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const setType = (typeVal: string) => {
    dispatch({
      type: HANDLERS.SET_TYPE,
      payload: { type: typeVal },
    });
  };

  const setEvents = (events: MessageMonitor.Event[]) => {
    dispatch({
      type: HANDLERS.SET_EVENTS,
      payload: { events },
    });
    dispatch({
      type: HANDLERS.SET_ASSESSMENTS,
      payload: { assessments: [] },
    });
    dispatch({
      type: HANDLERS.SET_GRAPH_DATA,
      payload: { graphData: [] },
    });
  };

  const setAssessments = (assessments: Assessment[]) => {
    dispatch({
      type: HANDLERS.SET_ASSESSMENTS,
      payload: { assessments },
    });
    dispatch({
      type: HANDLERS.SET_EVENTS,
      payload: { events: [] },
    });
    dispatch({
      type: HANDLERS.SET_GRAPH_DATA,
      payload: { graphData: [] },
    });
  };

  const setGraphData = (graphData: Array<GraphArrayDataType>) => {
    dispatch({
      type: HANDLERS.SET_GRAPH_DATA,
      payload: { graphData },
    });
    dispatch({
      type: HANDLERS.SET_EVENTS,
      payload: { events: [] },
    });
    dispatch({
      type: HANDLERS.SET_ASSESSMENTS,
      payload: { assessments: [] },
    });
  };

  const setOpenMapDialog = (openMapDialog: boolean) => {
    dispatch({
      type: HANDLERS.SET_OPEN_MAP_DIALOG,
      payload: { openMapDialog },
    });
  };

  const setRoadRegulatorIntersectionIds = (roadRegulatorIntersectionIds: { [roadRegulatorId: number]: number[] }) => {
    dispatch({
      type: HANDLERS.SET_ROAD_REGULATOR_INTERSECTION_IDS,
      payload: { roadRegulatorIntersectionIds },
    });
  };

  const setDataSelectorForm = (form: DataSelectorFormType) => {
    dispatch({
      type: HANDLERS.SET_DATA_SELECTOR_FORM,
      payload: { form },
    });
  };

  return (
    <QueryContext.Provider
      value={{
        ...state,
        setType,
        setEvents,
        setAssessments,
        setGraphData,
        setOpenMapDialog,
        setRoadRegulatorIntersectionIds,
        setDataSelectorForm,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

QueryProvider.propTypes = {
  children: PropTypes.node,
};

export const QueryConsumer = QueryContext.Consumer;

export const useQueryContext = () => useContext<QueryContextType>(QueryContext);
