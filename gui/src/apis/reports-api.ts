import { authApiHelper } from "./api-helper";

class ReportsApi {
  async getReport({
    token,
    intersection_id,
    startTime,
    endTime,
  }: {
    token: string;
    intersection_id: string;
    startTime: Date;
    endTime: Date;
  }): Promise<Blob | undefined> {
    const queryParams: Record<string, string> = {};
    queryParams["intersection_id"] = intersection_id;
    if (startTime) queryParams["start_time_utc_millis"] = startTime.getTime().toString();
    if (endTime) queryParams["end_time_utc_millis"] = endTime.getTime().toString();

    const pdfReport = await authApiHelper.invokeApi({
      path: `/reports/generate`,
      token: token,
      responseType: "blob",
      queryParams,
      failureMessage: "Failed to generate PDF report",
    });

    return pdfReport;
  }
}

export default new ReportsApi();
