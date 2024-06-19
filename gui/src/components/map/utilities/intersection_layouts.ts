import {
  centerOnZeroDegrees,
  deg2rad,
  distanceAlongHeading,
  getBearingBetweenPoints,
  projectLongLat,
} from "./gps_utils";

const mapMessage = {
  mapFeatureCollection: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: 17,
        geometry: {
          coordinates: [
            [-105.091209, 39.5989858],
            [-105.0912098, 39.5990231],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [1485, 1391], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-7, 414], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 17,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 6,
          ingressApproach: 0,
          ingressPath: false,
          egressPath: true,
        },
      },
      {
        type: "Feature",
        id: 16,
        geometry: {
          coordinates: [
            [-105.0912649, 39.5989907],
            [-105.0912649, 39.5990273],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [1007, 1446], stopLine: null, delevation: -10, dwidth: null },
            { delta: [0, 407], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 16,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 6,
          ingressApproach: 0,
          ingressPath: false,
          egressPath: true,
        },
      },
      {
        type: "Feature",
        id: 15,
        geometry: {
          coordinates: [
            [-105.0913143, 39.5989901],
            [-105.0913143, 39.5990286],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [584, 1439], stopLine: null, delevation: -10, dwidth: null },
            { delta: [0, 428], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 15,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 6,
          ingressApproach: 0,
          ingressPath: false,
          egressPath: true,
        },
      },
      {
        type: "Feature",
        id: 14,
        geometry: {
          coordinates: [
            [-105.091433, 39.5989865],
            [-105.0914316, 39.5996311],
            [-105.0914443, 39.5997106],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-432, 1399], stopLine: null, delevation: null, dwidth: null },
            { delta: [12, 7162], stopLine: null, delevation: null, dwidth: null },
            { delta: [-109, 883], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 14,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 5,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: false,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: true,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: false,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 20,
                maneuver: {
                  maneuverStraightAllowed: false,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: true,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 1,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 11,
        geometry: {
          coordinates: [
            [-105.0915653, 39.5989859],
            [-105.0915579, 39.599573],
            [-105.0915447, 39.5997332],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-1565, 1392], stopLine: null, delevation: -10, dwidth: null },
            { delta: [63, 6523], stopLine: null, delevation: -10, dwidth: null },
            { delta: [113, 1780], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 11,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 5,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: false,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: false,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: true,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 10,
                maneuver: {
                  maneuverStraightAllowed: false,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: true,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: null,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 13,
        geometry: {
          coordinates: [
            [-105.0914804, 39.5989853],
            [-105.0914767, 39.5997104],
            [-105.0914637, 39.5999796],
            [-105.091472, 39.6004067],
            [-105.0914519, 39.6030778],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-838, 1385], stopLine: null, delevation: null, dwidth: null },
            { delta: [32, 8057], stopLine: null, delevation: -10, dwidth: null },
            { delta: [111, 2991], stopLine: null, delevation: 10, dwidth: null },
            { delta: [-71, 4746], stopLine: null, delevation: -20, dwidth: null },
            { delta: [172, 29679], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 13,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 5,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: true,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: false,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: false,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 5,
                maneuver: {
                  maneuverStraightAllowed: true,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 6,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 12,
        geometry: {
          coordinates: [
            [-105.0915186, 39.5989857],
            [-105.0915154, 39.5995838],
            [-105.091521, 39.5998139],
            [-105.0915168, 39.6000665],
            [-105.0915106, 39.600585],
            [-105.0915029, 39.6030821],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-1165, 1390], stopLine: null, delevation: -10, dwidth: null },
            { delta: [27, 6645], stopLine: null, delevation: null, dwidth: null },
            { delta: [-48, 2557], stopLine: null, delevation: -10, dwidth: null },
            { delta: [36, 2807], stopLine: null, delevation: null, dwidth: null },
            { delta: [53, 5761], stopLine: null, delevation: -10, dwidth: null },
            { delta: [66, 27745], stopLine: null, delevation: 10, dwidth: null },
          ],
          laneId: 12,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 5,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: true,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: false,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: false,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 6,
                maneuver: {
                  maneuverStraightAllowed: true,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 6,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 10,
        geometry: {
          coordinates: [
            [-105.091637, 39.5989067],
            [-105.091684, 39.5989072],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-2179, 512], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-402, 6], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 10,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 4,
          ingressApproach: 0,
          ingressPath: false,
          egressPath: true,
        },
      },
      {
        type: "Feature",
        id: 8,
        geometry: {
          coordinates: [
            [-105.0916378, 39.5987993],
            [-105.092281, 39.5988034],
            [-105.0924248, 39.598811],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-2186, -681], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-5507, 45], stopLine: null, delevation: null, dwidth: null },
            { delta: [-1231, 84], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 8,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 3,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: false,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: false,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: true,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 7,
                maneuver: {
                  maneuverStraightAllowed: false,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: true,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: null,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 9,
        geometry: {
          coordinates: [
            [-105.0916395, 39.5988422],
            [-105.0922758, 39.5988434],
            [-105.0924866, 39.5988337],
            [-105.0927716, 39.5988053],
            [-105.0929595, 39.5987714],
            [-105.0931995, 39.598692],
            [-105.0934127, 39.598598],
            [-105.0936479, 39.5984496],
            [-105.0938989, 39.5982835],
            [-105.0941595, 39.5981538],
            [-105.0943964, 39.5980829],
            [-105.0945669, 39.5980472],
            [-105.0947169, 39.5980339],
            [-105.0948866, 39.5980206],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-2200, -204], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-5448, 13], stopLine: null, delevation: null, dwidth: null },
            { delta: [-1805, -108], stopLine: null, delevation: null, dwidth: null },
            { delta: [-2440, -316], stopLine: null, delevation: null, dwidth: null },
            { delta: [-1609, -377], stopLine: null, delevation: 10, dwidth: null },
            { delta: [-2055, -882], stopLine: null, delevation: null, dwidth: null },
            { delta: [-1825, -1044], stopLine: null, delevation: 10, dwidth: null },
            { delta: [-2014, -1649], stopLine: null, delevation: null, dwidth: null },
            { delta: [-2149, -1845], stopLine: null, delevation: null, dwidth: null },
            { delta: [-2231, -1441], stopLine: null, delevation: 10, dwidth: null },
            { delta: [-2028, -788], stopLine: null, delevation: null, dwidth: null },
            { delta: [-1460, -397], stopLine: null, delevation: 10, dwidth: null },
            { delta: [-1284, -148], stopLine: null, delevation: null, dwidth: null },
            { delta: [-1453, -148], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 9,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 3,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: true,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: true,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: false,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 20,
                maneuver: {
                  maneuverStraightAllowed: true,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 4,
              userClass: null,
              connectionID: 1,
            },
            {
              connectingLane: {
                lane: 15,
                maneuver: {
                  maneuverStraightAllowed: false,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: true,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 4,
              userClass: null,
              connectionID: 2,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 5,
        geometry: {
          coordinates: [
            [-105.0914778, 39.5987184],
            [-105.0914778, 39.5986876],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-816, -1580], stopLine: null, delevation: null, dwidth: null },
            { delta: [0, -342], stopLine: null, delevation: -10, dwidth: null },
          ],
          laneId: 5,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 2,
          ingressApproach: 0,
          ingressPath: false,
          egressPath: true,
        },
      },
      {
        type: "Feature",
        id: 6,
        geometry: {
          coordinates: [
            [-105.0915195, 39.5987179],
            [-105.0915202, 39.5986888],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-1173, -1586], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-6, -323], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 6,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 2,
          ingressApproach: 0,
          ingressPath: false,
          egressPath: true,
        },
      },
      {
        type: "Feature",
        id: 7,
        geometry: {
          coordinates: [
            [-105.0915694, 39.5987167],
            [-105.0915701, 39.5986888],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [-1600, -1599], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-6, -310], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 7,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 2,
          ingressApproach: 0,
          ingressPath: false,
          egressPath: true,
        },
      },
      {
        type: "Feature",
        id: 1,
        geometry: {
          coordinates: [
            [-105.0912143, 39.5987182],
            [-105.0912234, 39.5980589],
            [-105.0912408, 39.5978949],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [1440, -1582], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-78, -7326], stopLine: null, delevation: 20, dwidth: null },
            { delta: [-149, -1822], stopLine: null, delevation: 10, dwidth: null },
          ],
          laneId: 1,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 1,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: false,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: false,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: true,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 20,
                maneuver: {
                  maneuverStraightAllowed: false,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: true,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: null,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 2,
        geometry: {
          coordinates: [
            [-105.0912622, 39.5987184],
            [-105.0912679, 39.5980799],
            [-105.091269, 39.5975175],
            [-105.0912689, 39.5946024],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [1030, -1580], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-49, -7094], stopLine: null, delevation: 20, dwidth: null },
            { delta: [-9, -6249], stopLine: null, delevation: 20, dwidth: null },
            { delta: [1, -32390], stopLine: null, delevation: -60, dwidth: null },
          ],
          laneId: 2,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 1,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: true,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: false,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: false,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 16,
                maneuver: {
                  maneuverStraightAllowed: true,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 2,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 3,
        geometry: {
          coordinates: [
            [-105.0913088, 39.598718],
            [-105.0913094, 39.5981064],
            [-105.0913175, 39.5977888],
            [-105.0913154, 39.5974904],
            [-105.091314, 39.5973723],
            [-105.0913125, 39.5971622],
            [-105.09132, 39.5946046],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [631, -1584], stopLine: null, delevation: -10, dwidth: null },
            { delta: [-5, -6796], stopLine: null, delevation: 10, dwidth: null },
            { delta: [-69, -3529], stopLine: null, delevation: 20, dwidth: null },
            { delta: [18, -3315], stopLine: null, delevation: 10, dwidth: null },
            { delta: [12, -1312], stopLine: null, delevation: null, dwidth: null },
            { delta: [13, -2334], stopLine: null, delevation: 10, dwidth: null },
            { delta: [-64, -28418], stopLine: null, delevation: -70, dwidth: null },
          ],
          laneId: 3,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 1,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: true,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: false,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: false,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 15,
                maneuver: {
                  maneuverStraightAllowed: true,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 2,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 4,
        geometry: {
          coordinates: [
            [-105.0913563, 39.5987187],
            [-105.0913505, 39.5981093],
            [-105.0913333, 39.5979134],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [224, -1577], stopLine: null, delevation: null, dwidth: null },
            { delta: [50, -6771], stopLine: null, delevation: 10, dwidth: null },
            { delta: [147, -2177], stopLine: null, delevation: 10, dwidth: null },
          ],
          laneId: 4,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 1,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: false,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: true,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: false,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 10,
                maneuver: {
                  maneuverStraightAllowed: false,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: true,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 5,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 18,
        geometry: {
          coordinates: [
            [-105.0911413, 39.5989205],
            [-105.0905399, 39.598918],
            [-105.0904679, 39.5989093],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [2065, 665], stopLine: null, delevation: -20, dwidth: null },
            { delta: [5149, -28], stopLine: null, delevation: -10, dwidth: null },
            { delta: [616, -97], stopLine: null, delevation: null, dwidth: null },
          ],
          laneId: 18,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 7,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: false,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: false,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: true,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 17,
                maneuver: {
                  maneuverStraightAllowed: false,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: true,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: null,
              userClass: null,
              connectionID: 1,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 19,
        geometry: {
          coordinates: [
            [-105.0911462, 39.5988889],
            [-105.0905116, 39.5988852],
            [-105.0903426, 39.5989001],
            [-105.0897464, 39.5988963],
            [-105.0891397, 39.5988963],
            [-105.0889473, 39.5989174],
            [-105.0886748, 39.5989772],
            [-105.0884917, 39.5990633],
            [-105.0882827, 39.5991982],
            [-105.088111, 39.5993827],
            [-105.0880155, 39.5995539],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [2023, 314], stopLine: null, delevation: -20, dwidth: null },
            { delta: [5433, -41], stopLine: null, delevation: -10, dwidth: null },
            { delta: [1447, 165], stopLine: null, delevation: null, dwidth: null },
            { delta: [5104, -42], stopLine: null, delevation: 10, dwidth: null },
            { delta: [5194, 0], stopLine: null, delevation: null, dwidth: null },
            { delta: [1647, 234], stopLine: null, delevation: null, dwidth: null },
            { delta: [2333, 664], stopLine: null, delevation: null, dwidth: null },
            { delta: [1568, 957], stopLine: null, delevation: null, dwidth: null },
            { delta: [1789, 1499], stopLine: null, delevation: -10, dwidth: null },
            { delta: [1470, 2050], stopLine: null, delevation: null, dwidth: null },
            { delta: [818, 1902], stopLine: null, delevation: -10, dwidth: null },
          ],
          laneId: 19,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 0,
          ingressApproach: 7,
          ingressPath: true,
          egressPath: false,
          maneuvers: {
            maneuverStraightAllowed: true,
            maneuverNoStoppingAllowed: false,
            goWithHalt: false,
            maneuverLeftAllowed: true,
            maneuverUTurnAllowed: false,
            maneuverLeftTurnOnRedAllowed: false,
            reserved1: false,
            maneuverRightAllowed: false,
            maneuverLaneChangeAllowed: false,
            yieldAllwaysRequired: false,
            maneuverRightTurnOnRedAllowed: false,
            caution: false,
          },
          connectsTo: [
            {
              connectingLane: {
                lane: 10,
                maneuver: {
                  maneuverStraightAllowed: true,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: false,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 8,
              userClass: null,
              connectionID: 1,
            },
            {
              connectingLane: {
                lane: 5,
                maneuver: {
                  maneuverStraightAllowed: false,
                  maneuverNoStoppingAllowed: false,
                  goWithHalt: false,
                  maneuverLeftAllowed: true,
                  maneuverUTurnAllowed: false,
                  maneuverLeftTurnOnRedAllowed: false,
                  reserved1: false,
                  maneuverRightAllowed: false,
                  maneuverLaneChangeAllowed: false,
                  yieldAllwaysRequired: false,
                  maneuverRightTurnOnRedAllowed: false,
                  caution: false,
                },
              },
              remoteIntersection: null,
              signalGroup: 8,
              userClass: null,
              connectionID: 2,
            },
          ],
        },
      },
      {
        type: "Feature",
        id: 20,
        geometry: {
          coordinates: [
            [-105.0911456, 39.598817],
            [-105.0910906, 39.598817],
          ],
          type: "LineString",
        },
        properties: {
          nodes: [
            { delta: [2028, -484], stopLine: null, delevation: -10, dwidth: null },
            { delta: [471, 0], stopLine: null, delevation: -10, dwidth: null },
          ],
          laneId: 20,
          sharedWith: {
            busVehicleTraffic: false,
            trackedVehicleTraffic: false,
            individualMotorizedVehicleTraffic: false,
            taxiVehicleTraffic: false,
            overlappingLaneDescriptionProvided: false,
            cyclistVehicleTraffic: false,
            otherNonMotorizedTrafficTypes: false,
            multipleLanesTreatedAsOneLane: false,
            pedestrianTraffic: false,
            pedestriansTraffic: false,
          },
          egressApproach: 8,
          ingressApproach: 0,
          ingressPath: false,
          egressPath: true,
        },
      },
    ],
  },
  connectingLanesFeatureCollection: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "14-20",
        geometry: {
          coordinates: [
            [-105.091433, 39.5989865],
            [-105.0911456, 39.598817],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 1, ingressLaneId: 14, egressLaneId: 20 },
      },
      {
        type: "Feature",
        id: "11-10",
        geometry: {
          coordinates: [
            [-105.0915653, 39.5989859],
            [-105.091637, 39.5989067],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: null, ingressLaneId: 11, egressLaneId: 10 },
      },
      {
        type: "Feature",
        id: "13-5",
        geometry: {
          coordinates: [
            [-105.0914804, 39.5989853],
            [-105.0914778, 39.5987184],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 6, ingressLaneId: 13, egressLaneId: 5 },
      },
      {
        type: "Feature",
        id: "12-6",
        geometry: {
          coordinates: [
            [-105.0915186, 39.5989857],
            [-105.0915195, 39.5987179],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 6, ingressLaneId: 12, egressLaneId: 6 },
      },
      {
        type: "Feature",
        id: "8-7",
        geometry: {
          coordinates: [
            [-105.0916378, 39.5987993],
            [-105.0915694, 39.5987167],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: null, ingressLaneId: 8, egressLaneId: 7 },
      },
      {
        type: "Feature",
        id: "9-20",
        geometry: {
          coordinates: [
            [-105.0916395, 39.5988422],
            [-105.0911456, 39.598817],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 4, ingressLaneId: 9, egressLaneId: 20 },
      },
      {
        type: "Feature",
        id: "9-15",
        geometry: {
          coordinates: [
            [-105.0916395, 39.5988422],
            [-105.0913143, 39.5989901],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 4, ingressLaneId: 9, egressLaneId: 15 },
      },
      {
        type: "Feature",
        id: "1-20",
        geometry: {
          coordinates: [
            [-105.0912143, 39.5987182],
            [-105.0911456, 39.598817],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: null, ingressLaneId: 1, egressLaneId: 20 },
      },
      {
        type: "Feature",
        id: "2-16",
        geometry: {
          coordinates: [
            [-105.0912622, 39.5987184],
            [-105.0912649, 39.5989907],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 2, ingressLaneId: 2, egressLaneId: 16 },
      },
      {
        type: "Feature",
        id: "3-15",
        geometry: {
          coordinates: [
            [-105.0913088, 39.598718],
            [-105.0913143, 39.5989901],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 2, ingressLaneId: 3, egressLaneId: 15 },
      },
      {
        type: "Feature",
        id: "4-10",
        geometry: {
          coordinates: [
            [-105.0913563, 39.5987187],
            [-105.091637, 39.5989067],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 5, ingressLaneId: 4, egressLaneId: 10 },
      },
      {
        type: "Feature",
        id: "18-17",
        geometry: {
          coordinates: [
            [-105.0911413, 39.5989205],
            [-105.091209, 39.5989858],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: null, ingressLaneId: 18, egressLaneId: 17 },
      },
      {
        type: "Feature",
        id: "19-10",
        geometry: {
          coordinates: [
            [-105.0911462, 39.5988889],
            [-105.091637, 39.5989067],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 8, ingressLaneId: 19, egressLaneId: 10 },
      },
      {
        type: "Feature",
        id: "19-5",
        geometry: {
          coordinates: [
            [-105.0911462, 39.5988889],
            [-105.0914778, 39.5987184],
          ],
          type: "LineString",
        },
        properties: { signalGroupId: 8, ingressLaneId: 19, egressLaneId: 5 },
      },
    ],
  },
  properties: {
    messageType: "MAP",
    odeReceivedAt: 1718118710.592,
    originIp: "10.11.81.14",
    intersectionId: 12111,
    msgIssueRevision: 2,
    revision: 2,
    refPoint: { latitude: 39.5988606, longitude: -105.0913825, elevation: 1677.0 },
    cti4501Conformant: false,
    validationMessages: [
      {
        message: "$.metadata.receivedMessageDetails.locationData: is missing but it is required",
        jsonPath: "$.metadata.receivedMessageDetails",
        schemaPath: "#/$defs/OdeMapMetadata/properties/receivedMessageDetails/required",
      },
      {
        message: "$.payload.data.intersections.intersectionGeometry[0].id.region: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].id",
        schemaPath: "#/$defs/J2735IntersectionReferenceID/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[0].maneuvers: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[0]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[0].connectsTo: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[0]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[1].maneuvers: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[1]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[1].connectsTo: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[1]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[2].maneuvers: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[2]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[2].connectsTo: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[2]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[4].connectsTo.connectsTo[0].signalGroup: is missing but it is required",
        jsonPath:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[4].connectsTo.connectsTo[0]",
        schemaPath: "#/$defs/J2735Connection/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[7].maneuvers: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[7]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[7].connectsTo: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[7]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[8].connectsTo.connectsTo[0].signalGroup: is missing but it is required",
        jsonPath:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[8].connectsTo.connectsTo[0]",
        schemaPath: "#/$defs/J2735Connection/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[10].maneuvers: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[10]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[10].connectsTo: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[10]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[11].maneuvers: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[11]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[11].connectsTo: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[11]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[12].maneuvers: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[12]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[12].connectsTo: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[12]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[13].connectsTo.connectsTo[0].signalGroup: is missing but it is required",
        jsonPath:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[13].connectsTo.connectsTo[0]",
        schemaPath: "#/$defs/J2735Connection/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[17].connectsTo.connectsTo[0].signalGroup: is missing but it is required",
        jsonPath:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[17].connectsTo.connectsTo[0]",
        schemaPath: "#/$defs/J2735Connection/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[19].maneuvers: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[19]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message:
          "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[19].connectsTo: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0].laneSet.GenericLane[19]",
        schemaPath: "#/$defs/J2735GenericLane/required",
      },
      {
        message: "$.payload.data.intersections.intersectionGeometry[0].speedLimits: is missing but it is required",
        jsonPath: "$.payload.data.intersections.intersectionGeometry[0]",
        schemaPath: "#/$defs/J2735IntersectionGeometry/required",
      },
    ],
    laneWidth: 366,
    mapSource: "RSU",
    timeStamp: 1718118710.592,
  },
};

// export function getSignalHeadLocations(
//   layoutType: IntersectionSHLayoutType,
//   mapMessage: ProcessedMap
// ): { type: "FeatureCollection"; features: any[] } {
//   switch (layoutType) {
//     case "4_SQUARE":
//       return getSignalHeadLocations4Square(mapMessage);
//     // case "4_DOUBLE_SQUARE":
//     //   return getSignalHeadLocations4DoubleSquare(mapMessage);
//     // case "4_DIAGONAL":
//     //   return getSignalHeadLocations4Diagonal(mapMessage);
//   }
//   return { type: "FeatureCollection", features: [] };
// }

// function getIntersectionBoundingBox(mapMessage: ProcessedMap, numDirections: number): number[][] {
//   switch (numDirections) {
//     case 4:
//       return getIntersectionBoundingBox4(mapMessage);
//     default:
//       return [];
//   }
// }

// function getIntersectionBoundingBox4(mapMessage: ProcessedMap): number[][] {
//   const edges: number[][] = mapMessage.mapFeatureCollection.features.map((feature) => {
//     const coordinates = feature.geometry.coordinates;
//     return coordinates[0];
//   });

//   // fit a 4-sided polygon around the intersection edges
//   return getRectangleOfBestFit(edges);
// }

// function fitRectangle(points: number[][]): number[][] {
//   // Step 1: Compute the mean of the x and y coordinates
//   const meanPoint = mean(points, 0);

//   // Step 2: Subtract the mean from the original coordinates
//   const centeredPoints = subtract(points, meanPoint);

//   // Step 3: Compute the covariance matrix of the centered coordinates
//   let covMatrix = multiply(transpose(centeredPoints), centeredPoints);
//   covMatrix = divide(covMatrix, points.length - 1);

//   // Step 4: Compute the eigenvalues and eigenvectors of the covariance matrix
//   const { eigenvectors } = eigs(covMatrix);

//   // Step 5: Project the centered coordinates onto the eigenvectors
//   const rotatedPoints = multiply(centeredPoints, eigenvectors);

//   // Step 6: Compute the minimum and maximum x and y in the rotated frame
//   const minX = Math.min(...rotatedPoints.map((p) => p[0]));
//   const maxX = Math.max(...rotatedPoints.map((p) => p[0]));
//   const minY = Math.min(...rotatedPoints.map((p) => p[1]));
//   const maxY = Math.max(...rotatedPoints.map((p) => p[1]));

//   // Step 7: Transform the corners back to the original frame
//   const cornersRotated = [
//     [minX, minY],
//     [maxX, minY],
//     [maxX, maxY],
//     [minX, maxY],
//   ];
//   const corners = add(multiply(cornersRotated, transpose(eigenvectors)), meanPoint);

//   return corners;
// }

// function getRectangleOfBestFit(points) {
//   // Calculate the mean of the points
//   const mean = points
//     .reduce(
//       (acc, point) => {
//         acc[0] += point[0];
//         acc[1] += point[1];
//         return acc;
//       },
//       [0, 0]
//     )
//     .map((coord) => coord / points.length);

//   // Center the points by subtracting the mean
//   const centeredPoints = points.map((point) => [point[0] - mean[0], point[1] - mean[1]]);

//   // Calculate the covariance matrix
//   const covMatrix = [
//     [0, 0],
//     [0, 0],
//   ];
//   centeredPoints.forEach((point) => {
//     covMatrix[0][0] += point[0] * point[0];
//     covMatrix[0][1] += point[0] * point[1];
//     covMatrix[1][0] += point[1] * point[0];
//     covMatrix[1][1] += point[1] * point[1];
//   });
//   covMatrix[0][0] /= points.length;
//   covMatrix[0][1] /= points.length;
//   covMatrix[1][0] /= points.length;
//   covMatrix[1][1] /= points.length;

//   // Calculate the eigenvalues and eigenvectors of the covariance matrix
//   const a = covMatrix[0][0];
//   const b = covMatrix[0][1];
//   const c = covMatrix[1][0];
//   const d = covMatrix[1][1];
//   const trace = a + d;
//   const det = a * d - b * c;
//   const eigenValue1 = trace / 2 + Math.sqrt((trace * trace) / 4 - det);
//   const eigenValue2 = trace / 2 - Math.sqrt((trace * trace) / 4 - det);

//   const eigenVector1 = [b, eigenValue1 - a].map((v) => v / Math.hypot(b, eigenValue1 - a));
//   const eigenVector2 = [b, eigenValue2 - a].map((v) => v / Math.hypot(b, eigenValue2 - a));

//   // Project the points onto the eigenvectors to get the bounding box
//   const projections = centeredPoints.map((point) => [
//     point[0] * eigenVector1[0] + point[1] * eigenVector1[1],
//     point[0] * eigenVector2[0] + point[1] * eigenVector2[1],
//   ]);

//   const minMaxProjections = projections.reduce(
//     (acc, proj) => {
//       acc.minX = Math.min(acc.minX, proj[0]);
//       acc.maxX = Math.max(acc.maxX, proj[0]);
//       acc.minY = Math.min(acc.minY, proj[1]);
//       acc.maxY = Math.max(acc.maxY, proj[1]);
//       return acc;
//     },
//     { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
//   );

//   // Calculate the corners of the bounding box
//   const corners = [
//     [minMaxProjections.minX, minMaxProjections.minY],
//     [minMaxProjections.maxX, minMaxProjections.minY],
//     [minMaxProjections.maxX, minMaxProjections.maxY],
//     [minMaxProjections.minX, minMaxProjections.maxY],
//   ];

//   // Transform the corners back to the original space
//   const rectangleCorners = corners.map((corner) => [
//     mean[0] + corner[0] * eigenVector1[0] + corner[1] * eigenVector2[0],
//     mean[1] + corner[0] * eigenVector1[1] + corner[1] * eigenVector2[1],
//   ]);

//   return rectangleCorners;
// }

// // Chat-GPT special! This was generated by requesting chatgpt to fit a rectangle to a set of edge points,
// //   which can be separated from the corners, should support rotated rectangles, and should minimize the error to the points.
// function getRectangleOfBestFit(points: number[][]) {
//   // Helper function to compute the convex hull using Graham scan algorithm
//   function convexHull(points) {
//     points.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

//     const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

//     const lower: number[][] = [];
//     for (let point of points) {
//       while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
//         lower.pop();
//       }
//       lower.push(point);
//     }

//     const upper: number[][] = [];
//     for (let i = points.length - 1; i >= 0; i--) {
//       let point = points[i];
//       while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
//         upper.pop();
//       }
//       upper.push(point);
//     }

//     upper.pop();
//     lower.pop();
//     return lower.concat(upper);
//   }

//   // Helper function to find the angle between two points
//   function angleBetween(p1, p2) {
//     return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
//   }

//   // Helper function to rotate a point around another point by an angle
//   function rotatePoint(point: number[], center: number[], angle: number) {
//     const x = point[0] - center[0];
//     const y = point[1] - center[1];
//     const newX = x * Math.cos(angle) - y * Math.sin(angle);
//     const newY = x * Math.sin(angle) + y * Math.cos(angle);
//     return [newX + center[0], newY + center[1]];
//   }

//   function calculateRSquared(points, rectangle) {
//     // Helper function to calculate the distance from a point to a line segment
//     function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
//       const A = px - x1;
//       const B = py - y1;
//       const C = x2 - x1;
//       const D = y2 - y1;

//       const dot = A * C + B * D;
//       const len_sq = C * C + D * D;
//       let param = -1;
//       if (len_sq !== 0) {
//         param = dot / len_sq;
//       }

//       let xx, yy;
//       if (param < 0) {
//         xx = x1;
//         yy = y1;
//       } else if (param > 1) {
//         xx = x2;
//         yy = y2;
//       } else {
//         xx = x1 + param * C;
//         yy = y1 + param * D;
//       }

//       const dx = px - xx;
//       const dy = py - yy;
//       return Math.sqrt(dx * dx + dy * dy);
//     }

//     // Calculate centroid of points
//     const centroid = points
//       .reduce(
//         (acc, point) => {
//           acc[0] += point[0];
//           acc[1] += point[1];
//           return acc;
//         },
//         [0, 0]
//       )
//       .map((coord) => coord / points.length);

//     // Calculate total sum of squares (totalSS)
//     const totalSS = points.reduce((acc, point) => {
//       const dx = point[0] - centroid[0];
//       const dy = point[1] - centroid[1];
//       return acc + dx * dx + dy * dy;
//     }, 0);

//     // Calculate residual sum of squares (residualSS)
//     const residualSS = points.reduce((acc, point) => {
//       const [px, py] = point;
//       const distances = rectangle.map(([x1, y1], i) => {
//         const [x2, y2] = rectangle[(i + 1) % rectangle.length];
//         return pointToSegmentDistance(px, py, x1, y1, x2, y2);
//       });
//       const minDistance = Math.min(...distances);
//       return acc + minDistance * minDistance;
//     }, 0);

//     // Calculate R-squared value
//     const rSquared = 1 - residualSS / totalSS;
//     return rSquared;
//   }

//   const hull = convexHull(points);
//   let maxRSquared = -Infinity;
//   let bestRectangle: number[][] = [];

//   for (let i = 0; i < hull.length; i++) {
//     const p1 = hull[i];
//     const p2 = hull[(i + 1) % hull.length];
//     const angle = -angleBetween(p1, p2);
//     const rotatedPoints = points.map((point) => rotatePoint(point, p1, angle));

//     const xs = rotatedPoints.map((p) => p[0]);
//     const ys = rotatedPoints.map((p) => p[1]);

//     const minX = Math.min(...xs);
//     const maxX = Math.max(...xs);
//     const minY = Math.min(...ys);
//     const maxY = Math.max(...ys);

//     const potentialRectangle = [
//       rotatePoint([minX, minY], p1, -angle),
//       rotatePoint([maxX, minY], p1, -angle),
//       rotatePoint([maxX, maxY], p1, -angle),
//       rotatePoint([minX, maxY], p1, -angle),
//     ];

//     const rSquared = calculateRSquared(points, potentialRectangle);
//     if (rSquared > maxRSquared) {
//       maxRSquared = rSquared;
//       bestRectangle = potentialRectangle;
//     }
//   }

//   return bestRectangle;
// }

// function getRectangleOfBestFit(lines) {
//     // Helper function to compute the angle of a line
//     function angleOfLine(p1, p2) {
//         return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
//     }

//     // Helper function to rotate a point around another point by an angle
//     function rotatePoint(point, center, angle) {
//         const x = point[0] - center[0];
//         const y = point[1] - center[1];
//         const newX = x * Math.cos(angle) - y * Math.sin(angle);
//         const newY = x * Math.sin(angle) + y * Math.cos(angle);
//         return [newX + center[0], newY + center[1]];
//     }

//     // Helper function to calculate the distance from a point to a line segment
//     function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
//         const A = px - x1;
//         const B = py - y1;
//         const C = x2 - x1;
//         const D = y2 - y1;

//         const dot = A * C + B * D;
//         const len_sq = C * C + D * D;
//         let param = -1;
//         if (len_sq !== 0) {
//             param = dot / len_sq;
//         }

//         let xx, yy;
//         if (param < 0) {
//             xx = x1;
//             yy = y1;
//         } else if (param > 1) {
//             xx = x2;
//             yy = y2;
//         } else {
//             xx = x1 + param * C;
//             yy = y1 + param * D;
//         }

//         const dx = px - xx;
//         const dy = py - yy;
//         return Math.sqrt(dx * dx + dy * dy);
//     }

//     // Function to calculate R-squared value
//     function calculateRSquared(points, rectangle) {
//         // Calculate centroid of points
//         const centroid = points.reduce((acc, point) => {
//             acc[0] += point[0];
//             acc[1] += point[1];
//             return acc;
//         }, [0, 0]).map(coord => coord / points.length);

//         // Calculate total sum of squares (totalSS)
//         const totalSS = points.reduce((acc, point) => {
//             const dx = point[0] - centroid[0];
//             const dy = point[1] - centroid[1];
//             return acc + dx * dx + dy * dy;
//         }, 0);

//         // Calculate residual sum of squares (residualSS)
//         const residualSS = points.reduce((acc, point) => {
//             const [px, py] = point;
//             const distances = rectangle.map(([x1, y1], i) => {
//                 const [x2, y2] = rectangle[(i + 1) % rectangle.length];
//                 return pointToSegmentDistance(px, py, x1, y1, x2, y2);
//             });
//             const minDistance = Math.min(...distances);
//             return acc + minDistance * minDistance;
//         }, 0);

//         // Calculate R-squared value
//         const rSquared = 1 - (residualSS / totalSS);
//         return rSquared;
//     }

//     // Calculate the mean angle of the lines
//     let sumSin = 0;
//     let sumCos = 0;
//     lines.forEach(line => {
//         const [p1, p2] = line;
//         const angle = angleOfLine(p1, p2);
//         sumSin += Math.sin(angle);
//         sumCos += Math.cos(angle);
//     });

//     const meanAngle = Math.atan2(sumSin, sumCos);
//     const perpendicularAngle = meanAngle + Math.PI / 2;

//     // Find the bounding box aligned with the meanAngle and perpendicularAngle
//     const rotatedPoints = points.map(point => rotatePoint(point, [0, 0], -meanAngle));
//     const xs = rotatedPoints.map(p => p[0]);
//     const ys = rotatedPoints.map(p => p[1]);

//     const minX = Math.min(...xs);
//     const maxX = Math.max(...xs);
//     const minY = Math.min(...ys);
//     const maxY = Math.max(...ys);

//     const potentialRectangle = [
//         rotatePoint([minX, minY], [0, 0], meanAngle),
//         rotatePoint([maxX, minY], [0, 0], meanAngle),
//         rotatePoint([maxX, maxY], [0, 0], meanAngle),
//         rotatePoint([minX, maxY], [0, 0], meanAngle),
//     ];

//     return potentialRectangle;
// }

// Example usage
// const points = [
//   [1, 1],
//   [2, 2],
//   [0, 4],
//   [-2, 2],
//   [0, 0],
// ];
// const points = [
//   [8, 4],
//   [8, 6],
//   [6, 8],
//   [4, 8],
//   [2, 6],
//   [2, 4],
//   [4, 2],
//   [6, 2],
//   //   [7, 7],
//   //   [7, 3],
//   //   [3, 3],
//   //   [3, 7],
// ];

// interface ProcessedMapFeature {
//   type: string;
//   id: number;
//   geometry: {
//     coordinates: number[][];
//     type: string;
//   };
//   properties: {
//     laneId: number;
//     ingressPath: boolean;
//     egressPath: boolean;
//     angle?: number;
//   };
// }

interface ProcessedMapFeatureGroup {
  features: MapFeature[];
  angle: number;
}

interface ProcessedMapFeatureOpposingGroup {
  group1: MapFeature[];
  group2: MapFeature[];
  angle: number;
  distanceToExpand?: number;
}

interface SignalHeadFeature {
  type: string;
  id: number;
  geometry: {
    coordinates: number[];
    type: string;
  };
  properties: {
    laneId: number;
    signalGroup?: number;
    angle?: number;
  };
}

// Function to calculate intersection center
export function calculateIntersectionCenter(features: MapFeature[]): number[] {
  let totalLat = 0,
    totalLon = 0;
  let numPoints = 0;
  for (const feature of features) {
    totalLon += feature.geometry.coordinates[0][0];
    totalLat += feature.geometry.coordinates[0][1];
    numPoints++;
  }
  return [totalLon / numPoints, totalLat / numPoints];
}

// Function to group lanes by direction (vector between first and second points)
export function groupLanesByOrientation(features: MapFeature[]): ProcessedMapFeatureOpposingGroup[] {
  const groups: ProcessedMapFeatureGroup[] = [];
  const ANGLE_THRESHOLD_DEGREES = 15;

  // Iterate through each lane segment
  for (const lane of features) {
    if (lane.geometry.coordinates.length < 2) {
      continue; // Skip lanes with less than 2 points
    }

    // Calculate vector between first and second points
    const angle = centerOnZeroDegrees(
      getBearingBetweenPoints(lane.geometry.coordinates[0], lane.geometry.coordinates[1])
    );
    lane.properties.angle = angle;

    // Find or create a group based on the direction vector and angle threshold
    let foundGroup = false;
    for (const group of groups) {
      let angleDiff = angle - group.angle;
      // Compare angle with threshold (convert threshold to radians)
      if (Math.abs(angleDiff) <= ANGLE_THRESHOLD_DEGREES) {
        group.features.push(lane);
        group.angle = (group.angle * (group.features.length - 1) + angle) / group.features.length;
        foundGroup = true;
        break;
      }
    }

    // If no suitable group is found, create a new group
    if (!foundGroup) {
      groups.push({ features: [lane], angle: angle });
    }
  }

  const opposingGroups: ProcessedMapFeatureOpposingGroup[] = [];
  const removedGroups: { [id: number]: boolean } = {};
  let copiedGroups = [...groups];
  for (const group of groups) {
    let didFindOpposingGroup = false;
    for (const otherGroup of copiedGroups) {
      if (group === otherGroup || didFindOpposingGroup || removedGroups[otherGroup.features[0].id]) {
        continue;
      }
      const otherGroupAngleReversed = centerOnZeroDegrees(otherGroup.angle + 180);

      const angleDiff = group.angle - otherGroupAngleReversed;
      if (Math.abs(angleDiff) < ANGLE_THRESHOLD_DEGREES) {
        opposingGroups.push({
          group1: group.features,
          group2: otherGroup.features,
          angle: (group.angle + otherGroupAngleReversed) / 2,
        });

        // remove entries from copiedGroups
        removedGroups[otherGroup.features[0].id] = true;
        didFindOpposingGroup = true;
        continue;
      }
    }
    if (!didFindOpposingGroup && !removedGroups[group.features[0].id]) {
      opposingGroups.push({ group1: group.features, group2: [], angle: group.angle });
      copiedGroups = copiedGroups.splice(copiedGroups.indexOf(group), 1);
      removedGroups[group.features[0].id] = true;
    }
  }

  return opposingGroups;
}

// Function to generate signal head locations by flipping them across the intersection
function flipSignalHeadsAcrossIntersection(
  opposingGroups: ProcessedMapFeatureOpposingGroup[],
  underIngressLanes: boolean
): SignalHeadFeature[] {
  const signalHeads: SignalHeadFeature[] = [];

  // Iterate through each group of lanes
  for (const group of opposingGroups) {
    for (const feature of group.group1.filter((f) => f.properties.ingressPath)) {
      const startPoint = feature.geometry.coordinates[0]; // Assuming first point is the start point of the lane

      const reversedPoint = projectLongLat(startPoint, group.angle + 180, group.distanceToExpand! * 2 + 3);
      signalHeads.push({
        type: "Feature",
        id: feature.id,
        properties: {
          laneId: feature.properties.laneId,
          angle: group.angle + 180,
        },
        geometry: { type: "Point", coordinates: reversedPoint },
      });
      if (underIngressLanes) {
        signalHeads.push({
          type: "Feature",
          id: feature.id,
          properties: {
            laneId: feature.properties.laneId,
            angle: group.angle + 180,
          },
          geometry: { type: "Point", coordinates: startPoint },
        });
      }
    }

    for (const feature of group.group2.filter((f) => f.properties.ingressPath)) {
      const startPoint = feature.geometry.coordinates[0]; // Assuming first point is the start point of the lane

      const reversedPoint = projectLongLat(startPoint, group.angle, group.distanceToExpand! * 2 + 3);
      signalHeads.push({
        type: "Feature",
        id: feature.id,
        properties: {
          laneId: feature.properties.laneId,
          angle: group.angle + 180,
        },
        geometry: { type: "Point", coordinates: reversedPoint },
      });
      if (underIngressLanes) {
        signalHeads.push({
          type: "Feature",
          id: feature.id,
          properties: {
            laneId: feature.properties.laneId,
            angle: group.angle + 180,
          },
          geometry: { type: "Point", coordinates: startPoint },
        });
      }
    }
  }

  return signalHeads;
}

// Function to generate signal head locations
export function generateSignalHeadLocations(
  opposingGroups: ProcessedMapFeatureOpposingGroup[],
  intersectionCenter: number[],
  underIngressLanes: boolean = false
): SignalHeadFeature[] {
  // Iterate over each group (direction)
  for (const opposingGroup of opposingGroups) {
    for (const group of [opposingGroup.group1, opposingGroup.group2]) {
      if (group.length === 0) {
        continue;
      }
      // Calculate perpendicular vector for the group
      const projectedDistance: number = Math.min(
        ...group.map((f) =>
          Math.abs(distanceAlongHeading(intersectionCenter, f.geometry.coordinates[0], opposingGroup.angle))
        )
      );
      if (!opposingGroup.distanceToExpand || projectedDistance < opposingGroup.distanceToExpand) {
        opposingGroup.distanceToExpand = projectedDistance;
      }
    }
  }
  return flipSignalHeadsAcrossIntersection(opposingGroups, underIngressLanes);
}

function getSignalHeadLocationsEdges(mapMessage: ProcessedMap): SignalHeadFeature[] {
  const features: SignalHeadFeature[] = [];
  mapMessage?.connectingLanesFeatureCollection?.features?.forEach((connectingLane: ConnectingLanesFeature) => {
    if (!connectingLane.properties.signalGroupId) return;
    features.push({
      type: "Feature",
      id: connectingLane.properties.ingressLaneId,
      properties: {
        signalGroup: connectingLane.properties.signalGroupId,
        angle: getBearingBetweenPoints(connectingLane.geometry.coordinates[0], connectingLane.geometry.coordinates[1]),
        laneId: connectingLane.properties.ingressLaneId,
      },
      geometry: {
        type: "Point",
        coordinates: connectingLane.geometry.coordinates[0],
      },
    });
  });
  return features;
}

function getSignalHeadLocationsAcross(mapMessage: ProcessedMap): SignalHeadFeature[] {
  const intersectionLanes: MapFeature[] = mapMessage.mapFeatureCollection.features;

  // Step 1: Calculate intersection center
  const intersectionCenter = calculateIntersectionCenter(intersectionLanes);

  // Step 2: Group lanes by orientation
  const groups = groupLanesByOrientation(intersectionLanes);

  // Step 3: Generate shape inside the intersection
  const shapePoints = generateSignalHeadLocations(groups, intersectionCenter, false);

  return shapePoints;
}

export function getSignalHeadLocations(
  mapMessage: ProcessedMap,
  layoutType: IntersectionSHLayoutType
): SignalHeadFeature[] {
  switch (layoutType) {
    case "EDGES":
      return getSignalHeadLocationsEdges(mapMessage);
    case "ACROSS":
      return getSignalHeadLocationsAcross(mapMessage);
    case "ACROSS_AND_EDGES":
      return [...getSignalHeadLocationsEdges(mapMessage), ...getSignalHeadLocationsAcross(mapMessage)];
    case "DIAGONAL":
      throw new Error("DIAGONAL Intersection Layout Type Not Implemented");
  }
}

// const intersectionLanes: MapFeature[] = mapMessage.mapFeatureCollection.features.filter(
//   (f) => f.properties.ingressPath
// );

// // // Example usage:
// // const intersectionLanes: LaneEndpoint[][] = [
// //   [
// //     { lat: 40.7128, lon: -74.006 }, // Example lane point 1
// //     { lat: 40.7129, lon: -74.0059 }, // Example lane point 2
// //     // Add more points for lane 1 as needed
// //   ],
// //   [
// //     { lat: 40.7129, lon: -74.0059 }, // Example lane point 1
// //     { lat: 40.713, lon: -74.0058 }, // Example lane point 2
// //     // Add more points for lane 2 as needed
// //   ],
// //   // Add more lanes as needed
// // ];

// // Step 1: Calculate intersection center
// const intersectionCenter = calculateIntersectionCenter(intersectionLanes);

// function distanceBetweenPoints(p1: number[], p2: number[]) {
//   return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
// }

// // Step 2: Re-organize all lanes so the closest point is first
// for (const lane of intersectionLanes) {
//   const startPoint = lane.geometry.coordinates[0];
//   const endPoint = lane.geometry.coordinates[lane.geometry.coordinates.length - 1];
//   const distanceToStart = distanceBetweenPoints(intersectionCenter, startPoint);
//   const distanceToEnd = distanceBetweenPoints(intersectionCenter, endPoint);
//   if (distanceToEnd < distanceToStart) {
//     lane.geometry.coordinates.reverse();
//   }
// }

// // Step 3: Group lanes by orientation
// const groups = groupLanesByOrientation(intersectionLanes);

// console.log(JSON.stringify(groups));

// // Step 4: Generate shape inside the intersection
// const shapePoints = generateSignalHeadLocations(groups, intersectionCenter, false);

// console.log(
//   JSON.stringify({
//     type: "FeatureCollection",
//     features: [
//       ...shapePoints,
//       ...mapMessage.mapFeatureCollection.features,
//       {
//         type: "Feature",
//         properties: {
//           id: 1,
//           name: "Intersection Center",
//           type: "intersection",
//         },
//         geometry: {
//           type: "Point",
//           coordinates: intersectionCenter,
//         },
//       },
//     ],
//   })
// );

// console.log(
//   [-105.0911462, 39.5988889],
//   [-105.0905116, 39.5988852],
//   getBearingBetweenPoints([-105.0911462, 39.5988889], [-105.0905116, 39.5988852])
// );

// const points = [
//   [
//     [8, 4],
//     [8, 4],
//   ],
//   [8, 6],
//   [6, 8],
//   [4, 8],
//   [2, 6],
//   [2, 4],
//   [4, 2],
//   [6, 2],
// ];

// console.log(getRectangleOfBestFit(points));

// function getSignalHeadLocations4Square(mapMessage: ProcessedMap): { type: "FeatureCollection"; features: any[] } {
//   const features = [];
//   for (const [key, value] of Object.entries(mapMessage.intersections)) {
//     const intersection = value as Intersection;
//     const feature = {
//       type: "Feature",
//       properties: {
//         id: intersection.id,
//         name: intersection.name,
//         type: "intersection",
//       },
//       geometry: {
//         type: "Point",
//         coordinates: intersection.location,
//       },
//     };
//     features.push(feature);
//   }
//   return { type: "FeatureCollection", features: features };
// }
