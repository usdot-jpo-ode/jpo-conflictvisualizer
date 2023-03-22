
type LaneDirectionOfTravelAssessment = Assessment & {
  timestamp: number
  roadRegulatorID: number
  intersectionID: number
  laneDirectionOfTravelAssessmentGroup: LaneDirectionOfTravelAssessmentGroup[]
}