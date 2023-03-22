import { number } from "prop-types";
import { authApiHelper } from "./api-helper";

class AssessmentsApi {
  async getAssessment(
    token: string,
    eventType: string,
    intersection_id: number,
    startTime?: Date,
    endTime?: Date
  ): Promise<Assessment | undefined> {
    try {
      const queryParams: Record<string, string> = {};
      queryParams["road_regulator_id"] = "-1";
      queryParams["intersection_id"] = intersection_id.toString();
      queryParams["latest"] = "true";
      if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
      if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();

      var response = await authApiHelper.invokeApi({
        path: `/assessments/${eventType}`,
        token: token,
        queryParams,
      });
      return response.pop();
    } catch (exception_var) {
      console.error(exception_var);
      return undefined;
    }
  }
}

export default new AssessmentsApi();
