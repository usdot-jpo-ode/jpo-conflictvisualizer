import { number } from "prop-types";
import { authApiHelper } from "./api-helper";

class EventsApi {
  async getEvent(
    token: string,
    eventType: string,
    intersectionId: number,
    startTime: Date,
    endTime: Date,
    { latest = false }: { latest?: boolean } = {}
  ): Promise<MessageMonitor.Event[]> {
    try {
      var response = await authApiHelper.invokeApi({
        path: `/events/${eventType}`,
        token: token,
        queryParams: {
          intersection_id: intersectionId.toString(),
          start_time_utc_millis: startTime.getTime().toString(),
          end_time_utc_millis: endTime.getTime().toString(),
          latest: latest.toString(),
        },
      });
      return response;
    } catch (exception_var) {
      console.error(exception_var);
      return [];
    }
  }
}

export default new EventsApi();
