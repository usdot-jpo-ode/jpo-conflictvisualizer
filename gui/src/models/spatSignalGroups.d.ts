type SpatSignalGroups = {
  [datetime: number]: SpatSignalGroup[];
};

type SpatSignalGroup = {
  signalGroup: number;
  state: SignalState;
};

type SignalState = "STOP_AND_REMAIN" | "PROTECTED_CLEARANCE" | "PROTECTED_MOVEMENT_ALLOWED";

type SignalStateFeatureCollection = {
  type: "FeatureCollection";
  features: SignalStateFeature[];
};

type SignalStateFeature = {
  type: "Feature";
  properties: SignalStateProperties;
  geometry: PointGemetry;
};

type SignalStateProperties = {
  signalGroup: number;
  intersectionId?: number;
  color: string;
};

type PointGemetry = {
  type: "Point";
  coordinates: number[];
};
