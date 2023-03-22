import processed_map_data from "./fake_data/ProcessedMap.json";
import all_spat_data from "./fake_data/ProcessedSpat";
// import processed_spat_data from './fake_data/ProcessedSpatSingle.json';
// import bsm_data from './fake_data/BsmSingle.json';
import all_bsm_data from "./fake_data/10.11.81.12_BSMlist";
import intersectionsList from "./fake_data/intersections.json";
import { authApiHelper } from "./api-helper";
import assessments from "./fake_data/assessments.json";

class MessageMonitorApi {
  async getIntersections({ token }): Promise<IntersectionReferenceData[]> {
    try {
      var response = await authApiHelper.invokeApi({
        path: "/intersection/list",
        token: token,
      });
      return response;
    } catch (exception_var) {
      console.error(exception_var);
      return [];
    }

    //return intersectionsList;
  }

  async getSpatMessages({
    token,
    intersection_id,
    startTime,
    endTime,
  }: {
    token: string;
    intersection_id?: number;
    startTime?: Date;
    endTime?: Date;
  }): Promise<ProcessedSpat[]> {
    const queryParams: Record<string, string> = {};
    if (intersection_id) queryParams["intersection_id"] = intersection_id.toString();
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();

    var response = await authApiHelper.invokeApi({
      path: "/spat/json",
      token: token,
      queryParams,
    });
    return response as ProcessedSpat[];

    const data: string = all_spat_data;
    const spatData: ProcessedSpat[] = data.split("\n").map((line) => JSON.parse(line));
    return spatData;
  }

  // Assessments
  getSignalStateEventAssessment(): SignalStateAssessment {
    return assessments.signalStateAssessment;
  }

  // Assessments
  getSignalStateAssessment(): SignalStateAssessment {
    return assessments.signalStateAssessment;
  }

  getConnectionOfTravelAssessment(): ConnectionOfTravelAssessment {
    return assessments.connectionOfTravelAssessment;
  }

  getLaneDirectionOfTravelAssessment(): LaneDirectionOfTravelAssessment {
    return assessments.laneDirectionOfTravelAssessment;
  }

  async getMapMessages({
    token,
    intersection_id,
    startTime,
    endTime,
    latest,
  }: {
    token: string;
    intersection_id?: number;
    startTime?: Date;
    endTime?: Date;
    latest?: boolean;
  }): Promise<ProcessedMap[]> {
    const queryParams: Record<string, string> = {};
    if (intersection_id) queryParams["intersection_id"] = intersection_id.toString();
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();
    if (latest !== undefined) queryParams["latest"] = latest.toString();

    var response = await authApiHelper.invokeApi({
      path: "/map/json",
      token: token,
      queryParams,
    });
    return response as ProcessedMap[];
  }

  async getBsmMessages({
    token,
    vehicleId,
    startTime,
    endTime,
  }: {
    token: string;
    vehicleId?: string;
    startTime?: Date;
    endTime?: Date;
  }): Promise<OdeBsmData[]> {
    const queryParams: Record<string, string> = {};
    if (vehicleId) queryParams["origin_ip"] = vehicleId;
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();

    var response = await authApiHelper.invokeApi({
      path: "/bsm/json",
      token: token,
      queryParams,
    });
    return response as OdeBsmData[];

    const data: string = all_bsm_data;
    const bsmData: OdeBsmData[] = data.split("\n").map((line) => JSON.parse(line));
    return bsmData;
  }
}

export default new MessageMonitorApi();
