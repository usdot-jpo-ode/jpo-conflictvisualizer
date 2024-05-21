import { authApiHelper } from "./api-helper";

// const CONFIGURATION_PARAMETERS = [
// /config/intersection/signal_state/red_light_running_minimum_speed
// /config/intersection/signal_state/minimum_red_light_percentage_threshold
// /config/intersection/signal_state/minimum_number_of_events
// /config/intersection/signal_state/maximum_distance_from_stopbar
// /config/intersection/signal_state/look_back_period
// /config/intersection/signal_state/heading_tolerance
// /config/intersection/lane_direction_of_travel/minimum_speed_threshold
// /config/intersection/lane_direction_of_travel/minimum_number_of_points
// /config/intersection/lane_direction_of_travel/minimum_number_of_events
// /config/intersection/lane_direction_of_travel/look_back_period
// /config/intersection/lane_direction_of_travel/heading_tolerance
// /config/intersection/general/v2x_message_processing_frequency
// /config/intersection/general/spat_minimum_10_second_reception
// /config/intersection/general/spat_maximum_10_second_reception
// /config/intersection/general/message_storage_period
// /config/intersection/general/map_minimum_10_second_reception
// /config/intersection/general/map_maximum_10_second_reception
// /config/intersection/connection_of_travel/minimum_number_of_events
// /config/intersection/connection_of_travel/look_back_period
// ]

class ConfigParamsApi {
  async getGeneralParameters(token: string): Promise<Config[]> {
    // return ConfigParamsGeneral;
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/default/all",
        token: token,
        failureMessage: "Failed to retrieve general parameters",
      });
      return response ?? ([] as Config[]);
    } catch (exception_var) {
      console.error(exception_var);
      return [];
    }
  }

  async getIntersectionParameters(
    token: string,
    intersectionId: number,
    roadRegulatorId: number
  ): Promise<IntersectionConfig[]> {
    // return configParamsIntersection;
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection/unique",
        token: token,
        queryParams: { intersection_id: intersectionId.toString(), road_regulator_id: roadRegulatorId.toString() },
        failureMessage: "Failed to retrieve unique intersection parameters",
      });
      return response ?? ([] as IntersectionConfig[]);
    } catch (exception_var) {
      console.error(exception_var);
      return [];
    }
  }

  async getAllParameters(token: string, intersectionId: number, roadRegulatorId: number): Promise<Config[]> {
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection/unique",
        token: token,
        queryParams: { intersection_id: intersectionId.toString(), road_regulator_id: roadRegulatorId.toString() },
        failureMessage: "Failed to retrieve unique intersection parameters",
      });
      return response ?? ([] as IntersectionConfig[]);
    } catch (exception_var) {
      console.error(exception_var);
      return [];
    }
  }

  async getParameterGeneral(token: string, key: string): Promise<Config | undefined> {
    try {
      var response = (
        await authApiHelper.invokeApi({
          path: `/config/default/all`,
          token: token,
          failureMessage: `Failed to Retrieve Configuration Parameter ${key}`,
        })
      )
        .filter((c) => c.key === key)
        .at(-1);
      return response as Config;
    } catch (exception_var) {
      console.error(exception_var);
      return undefined;
    }
  }

  async getParameterIntersection(
    token: string,
    key: string,
    intersectionId: number,
    roadRegulatorId: number
  ): Promise<IntersectionConfig | undefined> {
    try {
      var response = (
        await authApiHelper.invokeApi({
          path: `/config/intersection/all`,
          token: token,
          queryParams: { intersection_id: intersectionId.toString(), road_regulator_id: roadRegulatorId.toString() },
          toastOnFailure: false,
          //   failureMessage: `Failed to Retrieve Configuration Parameter ${key}`,
        })
      )
        .filter((c) => c.key === key && c.intersectionID !== null && c.intersectionID !== 0 && c.intersectionID !== -1)
        .at(-1);
      return response as IntersectionConfig;
    } catch (exception_var) {
      console.error(exception_var);
      return undefined;
    }
  }

  async getParameter(
    token: string,
    key: string,
    intersectionId: number,
    roadRegulatorId: number
  ): Promise<Config | undefined> {
    // try to get intersection parameter first, if not found, get general parameter
    var param: Config | undefined = undefined;
    if (intersectionId !== -1) {
      var param: Config | undefined = await this.getParameterIntersection(token, key, intersectionId, roadRegulatorId);
    }
    if (param == undefined) {
      param = await this.getParameterGeneral(token, key);
    }
    return param;
  }

  async updateDefaultParameter(token: string, name: string, param: Config): Promise<Config | undefined> {
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/default",
        token: token,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: param,
        toastOnSuccess: true,
        successMessage: `Successfully Update Configuration Parameter ${name}`,
        failureMessage: `Failed to Update Configuration Parameter ${name}`,
      });
      return response as Config;
    } catch (exception_var) {
      console.error(exception_var);
      return undefined;
    }
  }

  async updateIntersectionParameter(
    token: string,
    name: string,
    param: IntersectionConfig
  ): Promise<IntersectionConfig | undefined> {
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection",
        token: token,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: param,
        toastOnSuccess: true,
        successMessage: `Successfully Update Intersection Configuration Parameter ${name}`,
        failureMessage: `Failed to Update Intersection Configuration Parameter ${name}`,
      });
      return response as IntersectionConfig;
    } catch (exception_var) {
      console.error(exception_var);
      return undefined;
    }
  }

  async createIntersectionParameter(
    token: string,
    name: string,
    value: Config,
    intersectionId: number,
    roadRegulatorId: number
  ): Promise<Config | undefined> {
    const param: IntersectionConfig = {
      intersectionID: intersectionId,
      roadRegulatorID: roadRegulatorId,
      rsuID: "rsu_1",
      ...value,
    };

    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection/create/" + name,
        token: token,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: param,
        toastOnSuccess: true,
        successMessage: `Successfully Created Intersection Configuration Parameter ${name}`,
        failureMessage: `Failed to Create Intersection Configuration Parameter ${name}`,
      });
      return response as Config;
    } catch (exception_var) {
      console.error(exception_var);
      return undefined;
    }
  }

  async removeOverriddenParameter(
    token: string,
    name: string,
    config: IntersectionConfig
  ): Promise<Config | undefined> {
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection",
        token: token,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: config,
        toastOnSuccess: true,
        successMessage: `Successfully Removed Intersection Configuration Parameter ${name}`,
        failureMessage: `Failed to Remove Intersection Configuration Parameter ${name}`,
      });
      return response as Config;
    } catch (exception_var) {
      console.error(exception_var);
      return undefined;
    }
  }
}

export const configParamApi = new ConfigParamsApi();
