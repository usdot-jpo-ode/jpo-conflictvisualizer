import { authApiHelper } from "./api-helper";
import ConfigParamsGeneral from "./fake_data/configParamsGeneral.json";
import configParamsIntersection from "./fake_data/configParamsIntersection.json";
import toast from "react-hot-toast";

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
      });
      return response as Config[];
    } catch (exception_var) {
      console.error(exception_var);
      return [];
    }
  }

  async getIntersectionParameters(
    token: string,
    intersectionId: string
  ): Promise<IntersectionConfig[]> {
    // return configParamsIntersection;
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection/unique",
        token: token,
        queryParams: { intersection_id: intersectionId, road_regulator_id: "1" },
      });
      return response as IntersectionConfig[];
    } catch (exception_var) {
      console.error(exception_var);
      return [];
    }
  }

  async getAllParameters(token: string, intersectionId: string): Promise<Config[]> {
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection/unique",
        token: token,
        queryParams: { intersection_id: intersectionId, road_regulator_id: "-1" },
      });
      return response as IntersectionConfig[];
    } catch (exception_var) {
      console.error(exception_var);
      return [];
    }
  }

  async getParameterGeneral(token: string, key: string): Promise<Config | null> {
    // return ConfigParamsGeneral.find((c) => c.key === key)!;
    try {
      var response = (
        await authApiHelper.invokeApi({
          path: `/config/default/all`, //${key}
          token: token,
          failureMessage: "Failed to Retrieve Configuration Parameter " + name,
        })
      )
        .filter((c) => c.key === key)
        .at(-1);
      return response as Config;
    } catch (exception_var) {
      console.error(exception_var);
      return null;
    }
  }

  async getParameterIntersection(
    token: string,
    key: string,
    road_regulator_id: string,
    intersection_id: string
  ): Promise<IntersectionConfig | null> {
    try {
      var response = (
        await authApiHelper.invokeApi({
          path: `/config/intersection/all`, //${key}
          token: token,
          queryParams: { intersection_id, road_regulator_id: "-1" },
          failureMessage: "Failed to Retrieve Configuration Parameter " + name,
        })
      )
        .filter((c) => c.key === key)
        .at(-1);
      return response as IntersectionConfig;
    } catch (exception_var) {
      console.error(exception_var);
      return null;
    }
  }

  async getParameter(
    token: string,
    key: string,
    road_regulator_id: string,
    intersection_id: string
  ): Promise<Config | null> {
    // try to get intersection parameter first, if not found, get general parameter
    var param: Config | null = await this.getParameterIntersection(
      token,
      key,
      road_regulator_id,
      intersection_id
    );
    if (param == null) {
      param = await this.getParameterGeneral(token, key);
    }
    return param;
  }

  async updateDefaultParameter(token: string, name: string, param: Config): Promise<Config | null> {
    // toast.success(`Successfully Update Configuration Parameter ${name}`);
    // return null;
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/default/",
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
      return null;
    }
  }

  async updateIntersectionParameter(
    token: string,
    name: string,
    param: IntersectionConfig
  ): Promise<IntersectionConfig | null> {
    // toast.success(`Successfully Update Configuration Parameter ${name}`);
    // return null;
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection/",
        token: token,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: param,
        toastOnSuccess: true,
        successMessage: `Successfully Update Configuration Parameter ${name}`,
        failureMessage: `Failed to Update Configuration Parameter ${name}`,
      });
      return response as IntersectionConfig;
    } catch (exception_var) {
      console.error(exception_var);
      return null;
    }
  }

  async createIntersectionParameter(
    token: string,
    name: string,
    value: Config,
    intersectionID: number
  ): Promise<Config | null> {
    toast.success(`Successfully Update Configuration Parameter ${name}`);
    // return null;

    const param: IntersectionConfig = {
      intersectionID: intersectionID,
      roadRegulatorID: -1,
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
        successMessage: `Successfully Update Configuration Parameter ${name}`,
        failureMessage: `Failed to Update Configuration Parameter ${name}`,
      });
      return response as Config;
    } catch (exception_var) {
      console.error(exception_var);
      return null;
    }
  }

  async removeOverriddenParameter(
    token: string,
    name: string,
    config: IntersectionConfig,
    intersectionID: number
  ): Promise<Config | null> {
    try {
      var response = await authApiHelper.invokeApi({
        path: "/config/intersection/",
        token: token,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: config,
        toastOnSuccess: true,
        successMessage: `Successfully Update Configuration Parameter ${name}`,
        failureMessage: `Failed to Update Configuration Parameter ${name}`,
      });
      return response as Config;
    } catch (exception_var) {
      console.error(exception_var);
      return null;
    }
  }
}

export const configParamApi = new ConfigParamsApi();
