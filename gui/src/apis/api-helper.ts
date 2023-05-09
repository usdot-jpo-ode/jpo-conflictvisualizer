import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const MESSAGE_MONITOR_ENDPOINT = `http://${publicRuntimeConfig.DOCKER_HOST_IP}:8081`;

class AuthApiHelper {
  formatQueryParams(query_params?: Record<string, any>): string {
    if (!query_params || Object.keys(query_params).length === 0) return "";
    return `?${new URLSearchParams(query_params).toString()}`;
  }

  async invokeApi({
    path,
    basePath,
    method = "GET",
    headers = {},
    queryParams,
    body,
    token,
    booleanResponse = false,
    toastOnFailure = true,
    toastOnSuccess = false,
    successMessage = "Successfully completed request!",
    failureMessage = "Request failed to complete",
  }: {
    path: string;
    basePath?: string;
    method?: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: Object;
    token?: string;
    booleanResponse?: boolean;
    toastOnFailure?: boolean;
    toastOnSuccess?: boolean;
    successMessage?: string;
    failureMessage?: string;
  }): Promise<any> {
    const url = (basePath ?? MESSAGE_MONITOR_ENDPOINT!) + path + this.formatQueryParams(queryParams);
    console.info("MAKING REQUEST TO", url);

    const localHeaders: HeadersInit = { ...headers };
    if (token) localHeaders["Authorization"] = `Bearer ${token}`;
    if (method === "POST" && body && !("Content-Type" in localHeaders)) {
      localHeaders["Content-Type"] = "application/json";
    }

    const options: RequestInit = {
      method: method,
      headers: localHeaders,
      body: body
        ? localHeaders["Content-Type"] == "application/x-www-form-urlencoded"
          ? (body as string)
          : JSON.stringify(body)
        : undefined,
    };

    return await fetch(url, options)
      .then((response: Response) => {
        if (response.ok) {
          if (toastOnSuccess) toast.success(successMessage);
          if (booleanResponse) return true;
        } else {
          console.error("Request failed with status code " + response.status + ": " + response.statusText);
          if (response.status === 401) {
            toast.error("Authentication failed, please sign in again");
            // signIn();
          } else if (response.status === 403) {
            toast.error("You are not authorized to perform this action.");
          } else if (toastOnFailure) toast.error(failureMessage + ", with status code " + response.status);

          if (booleanResponse) return false;
          return undefined;
        }
        const resp = response.json();
        resp.then((val) => console.debug("RESPONSE TO", url, val));
        return resp;
      })
      .catch((error: Error) => {
        toast.error("Fetch request failed: " + error.message);
        console.error(error.message);
      });
  }
}

export const authApiHelper = new AuthApiHelper();
