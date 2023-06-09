import { authApiHelper } from "./api-helper";

class GraphsApi {
  async getGraphData({
    token,
    intersection_id,
    data_type,
    startTime,
    endTime,
  }: {
    token: string;
    intersection_id: string;
    data_type: string;
    startTime: Date;
    endTime: Date;
  }): Promise<Array<any>> {
    const queryParams: Record<string, string> = {};
    queryParams["intersection_id"] = intersection_id;
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();
    if (data_type) queryParams["data_type"] = data_type;

    const pdfReport = await authApiHelper.invokeApi({
      path: `/data/graphs`,
      token: token,
      queryParams,
      failureMessage: "Failed to generate graph data",
    });

    return pdfReport;
  }
}

export default new GraphsApi();
