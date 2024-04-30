import * as turf from "@turf/turf";

export function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function rad2deg(rad: number) {
  return rad * (180 / Math.PI);
}

// get bearing between two lat/long points
export function getBearingBetweenPoints(start: number[], end: number[]) {
  if (!start || !end) return 0;
  const lat1 = deg2rad(start[1]!);
  const lon1 = deg2rad(start[0]!);
  const lat2 = deg2rad(end[1]!);
  const lon2 = deg2rad(end[0]!);
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  return rad2deg(brng);
}

export const getTimeRange = (startDate: Date, endDate: Date) => {
  return (endDate.getTime() - startDate.getTime()) / 100;
};

const addConnections = (
  connectingLanes: ConnectingLanesFeatureCollection,
  signalGroups: SpatSignalGroup[],
  mapFeatures: MapFeatureCollection
): ConnectingLanesFeatureCollectionWithSignalState => {
  //bounding box representing the edges of the intersection
  var bbox = turf.bbox(connectingLanes);

  //for each connecting lane, fetch its ingress and egress lanes
  connectingLanes.features?.forEach((connectionFeature: ConnectingLanesFeature) => {
    var ingressLaneId = connectionFeature.properties.ingressLaneId;
    var egressLaneId = connectionFeature.properties.egressLaneId;
    var ingressLane = mapFeatures.features.find((feature) => feature.id === ingressLaneId);
    var egressLane = mapFeatures.features.find((feature) => feature.id === egressLaneId);

    if (ingressLane && egressLane) {
      var ingressCoords = ingressLane.geometry.coordinates;
      var egressCoords = egressLane.geometry.coordinates;

      var ingressBearing = turf.bearing(ingressCoords[1], ingressCoords[0]);
      var egressBearing = turf.bearing(egressCoords[1], egressCoords[0]);

      //project the ingress/egress lanes through the intersection to the edge of the bbox
      var ingressLine = turf.lineString([
        ingressCoords[0],
        turf.destination(ingressCoords[0], 0.05, ingressBearing).geometry.coordinates,
      ]);
      var egressLine = turf.lineString([
        egressCoords[0],
        turf.destination(egressCoords[0], 0.05, egressBearing).geometry.coordinates,
      ]);
      var clippedIngress = turf.bboxClip(ingressLine, bbox);
      var clippedEgress = turf.bboxClip(egressLine, bbox);

      //find the intersection point of the projected lanes, if it exists
      var intersect = turf.lineIntersect(clippedIngress.geometry, clippedEgress.geometry);

      //if the lanes intersect within the intersection, this is a ~90 degree turn and we add 1 more point to round the curve
      if (intersect.features.length > 0) {
        var intersectPoint = intersect.features[0].geometry.coordinates;
        //the intersection would overshoot the curve, so curveMidpoint is a weighted average the intersection and connectingLanes edges
        var curveMidpoint = turf.centroid(
          turf.points([ingressCoords[0], egressCoords[0], intersectPoint, intersectPoint, intersectPoint])
        );

        var connectingLaneLine = turf.lineString([
          ingressCoords[0],
          curveMidpoint.geometry.coordinates,
          egressCoords[0],
        ]);
        var curve = turf.bezierSpline(connectingLaneLine);
        connectionFeature.geometry = curve.geometry;
      }

      //If the ingress and egress lanes are going in generally opposite directions and didn't intersect, use the U-turn calculations
      else if (Math.abs(ingressBearing - egressBearing) < 45) {
        //this formula was found experimentally to give a round curve and allow parallel curving lanes to not intersect
        var leadupLength = Math.min(turf.distance(ingressCoords[0], egressCoords[0]) * -7 + 0.045, -0.02);

        var normalizedIngressPoint = turf.destination(ingressCoords[0], leadupLength, ingressBearing);
        var normalizedEgressPoint = turf.destination(egressCoords[0], leadupLength, egressBearing);
        var connectingLaneLine = turf.lineString([
          normalizedIngressPoint.geometry.coordinates,
          ingressCoords[0],
          egressCoords[0],
          normalizedEgressPoint.geometry.coordinates,
        ]);

        var rawCurve = turf.bezierSpline(connectingLaneLine);
        //slice the curve back to remove the redundant ends
        var curve = turf.lineSlice(ingressCoords[0], egressCoords[0], rawCurve);
        connectionFeature.geometry = curve.geometry;
      }
      //anything else is mostly straight and doesn't require a bezier curve
    }
  });

  return {
    ...connectingLanes,
    features: connectingLanes.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        signalState: signalGroups.find((signalGroup) => signalGroup.signalGroup == feature.properties.signalGroupId)
          ?.state,
      },
    })),
  };
};
