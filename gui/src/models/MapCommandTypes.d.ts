type MAP_REFERENCE_TYPE = {
  /**
   * Center map on point with given latitude and longitude
   *
   * @param latitude - Latitude of desired center location
   * @param longitude - Longitude of desired center location
   * @param zoom - Optional, zoom of the map
   * @param heading - Optional, heading of the map
   * @param animationDurationMs - Optional, time to animate to new location, in milliseconds
   */
  centerMapOnPoint: ({
    latitude,
    longitude,
    zoom,
    heading,
    animationDurationMs,
  }: {
    latitude: number;
    longitude: number;
    zoom?: number;
    heading?: number;
    animationDurationMs?: number;
  }) => void;
};
