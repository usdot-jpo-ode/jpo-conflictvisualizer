import toast from "react-hot-toast";

const MESSAGE_MONITOR_ENDPOINT = "http://localhost:8081"; //process.env.MESSAGE_MONITOR_API_ENDPOINT;

class AuthApiHelper {
  formatQueryParams(query_params?: Record<string, any>): string {
    if (!query_params || Object.keys(query_params).length === 0) return "";
    return `?${new URLSearchParams(query_params).toString()}`;
  }

  async invokeApi({
    path,
    method = "GET",
    headers = {},
    queryParams,
    body,
    token,
    toastOnFailure = true,
    toastOnSuccess = false,
    successMessage = "Successfully completed request!",
    failureMessage = "Request failed to complete",
  }: {
    path: string;
    method?: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: Object;
    token: string;
    toastOnFailure?: boolean;
    toastOnSuccess?: boolean;
    successMessage?: string;
    failureMessage?: string;
  }): Promise<any> {
    const url = MESSAGE_MONITOR_ENDPOINT! + path + this.formatQueryParams(queryParams);
    console.info("MAKING REQUEST TO", url);

    const localHeaders: HeadersInit = { ...headers };
    if (method === "POST" && body) {
      localHeaders["Content-Type"] = "application/json";
    }

    const options: RequestInit = {
      method: method,
      headers: localHeaders,
      body: body ? JSON.stringify(body) : null,
    };

    return await fetch(url, options).then((response: Response) => {
      if (response.ok) {
        if (toastOnSuccess) toast.success(successMessage);
      } else {
        console.error(
          "Request failed with status code " + response.status + ": " + response.statusText
        );
        return undefined;
      }
      return response.json();
    });
    //   .catch((error: Error) => {
    //     if (toastOnFailure) toast.error(failureMessage);
    //     console.error(error.message);
    //   });
  }
}

export const authApiHelper = new AuthApiHelper();
