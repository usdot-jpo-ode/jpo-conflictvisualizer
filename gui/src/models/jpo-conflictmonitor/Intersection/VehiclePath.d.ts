
type VehiclePath = {
  pathPoints: number[][]
  bsms: BsmAggregator
  intersection: Intersection
  geometryFactory: GeometryFactory
  ingressLane: Lane
  egressLane: Lane
  ingressBsm: OdeBsmData
  egressBsm: OdeBsmData
}