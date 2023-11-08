import { number } from "prop-types";
import { authApiHelper } from "./api-helper";

class AssessmentsApi {
  async getLatestAssessment(
    token: string,
    eventType: string,
    intersection_id: string,
    roadRegulatorId?: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<Assessment | undefined> {
    const queryParams: Record<string, string> = {};
    // queryParams["road_regulator_id"] = road_regulator_id;
    queryParams["intersection_id"] = intersection_id;
    queryParams["latest"] = "true";
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();
    if (roadRegulatorId) queryParams["road_regulator_id"] = roadRegulatorId;

    var response =
      (await authApiHelper.invokeApi({
        path: `/assessments/${eventType}`,
        token: token,
        queryParams,
        failureMessage: `Failed to retrieve assessments of type ${eventType}`,
      })) ?? [];
    return response.pop();
  }

  async getAssessments(
    token: string,
    eventType: string,
    intersection_id: string,
    roadRegulatorId?: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<Assessment[]> {
    const queryParams: Record<string, string> = {};
    // queryParams["road_regulator_id"] = road_regulator_id;
    queryParams["intersection_id"] = intersection_id;
<<<<<<< HEAD
    queryParams["latest"] = "false";
=======
>>>>>>> 060a00bc139ca6085ca8e2aeedcf5f6687052b8d
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();
    if (roadRegulatorId) queryParams["road_regulator_id"] = roadRegulatorId;

    return (
      (await authApiHelper.invokeApi({
        path: `/assessments/${eventType}`,
        token: token,
        queryParams,
        failureMessage: `Failed to retrieve assessments of type ${eventType}`,
      })) ?? []
    );
  }
}

export default new AssessmentsApi();
