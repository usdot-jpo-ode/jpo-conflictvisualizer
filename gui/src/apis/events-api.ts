import { number } from "prop-types";
import { authApiHelper } from "./api-helper";

class EventsApi {
  async getEvent(
    token: string,
    eventType: string,
    intersectionId: number,
    startTime: Date,
    endTime: Date,
    roadRegulatorId?: string,
    { latest = false }: { latest?: boolean } = {}
  ): Promise<MessageMonitor.Event[]> {
    const queryParams = {
      intersection_id: intersectionId.toString(),
      start_time_utc_millis: startTime.getTime().toString(),
      end_time_utc_millis: endTime.getTime().toString(),
      latest: latest.toString(),
    };
    if (roadRegulatorId) queryParams["road_regulator_id"] = roadRegulatorId;

    const response = await authApiHelper.invokeApi({
      path: `/events/${eventType}`,
      token: token,
      queryParams: queryParams,
      failureMessage: `Failed to retrieve events of type ${eventType}`,
    });
    return response ?? ([] as MessageMonitor.Event[]);
  }
}

export default new EventsApi();
