export function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function rad2deg(rad: number) {
  return rad * (180 / Math.PI);
}

export function centerOnZeroDegrees(deg: number) {
  let val = deg % 360;
  if (val > 180) {
    return 360 - val;
  }
  return val;
}

// get bearing between two lat/long points
export function getBearingBetweenPoints(start: number[], end: number[]) {
  if (!start || !end) return 0;
  const lat1 = deg2rad(start[1]!);
  const lon1 = deg2rad(start[0]!);
  const lat2 = deg2rad(end[1]!);
  const lon2 = deg2rad(end[0]!);
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  return rad2deg(brng) % 360;
}

// Function to calculate Haversine distance between two points in meters
export function haversineDistance(p1: number[], p2: number[]): number {
  const lat1: number = p1[1];
  const lon1: number = p1[0];
  const lat2: number = p2[1];
  const lon2: number = p2[0];
  const R = 6371000; // Radius of the Earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Function to compute distance between two points projected along a given heading
export function distanceAlongHeading(p1: number[], p2: number[], heading: number): number {
  const headingRad = deg2rad(heading);
  const distance = haversineDistance(p1, p2);
  const initialBearing = deg2rad(getBearingBetweenPoints(p1, p2));

  const dotProduct = Math.sin(initialBearing) * Math.sin(headingRad) + Math.cos(initialBearing) * Math.cos(headingRad);
  const projectedDistance = distance * dotProduct;
  return projectedDistance;
}

// Function to project a point along a specified heading and distance
export function projectLongLat(point: number[], heading: number, distance: number): number[] {
  const lat: number = point[1];
  const lon: number = point[0];
  const earthRadius = 6371000; // Radius of the Earth in meters

  // Convert heading to radians
  const headingRad = deg2rad(heading);

  // Convert latitude and longitude to radians
  const latRad = deg2rad(lat);
  const lonRad = deg2rad(lon);

  // Calculate new latitude
  const newLat = Math.asin(
    Math.sin(latRad) * Math.cos(distance / earthRadius) +
      Math.cos(latRad) * Math.sin(distance / earthRadius) * Math.cos(headingRad)
  );

  // Calculate new longitude
  let newLon =
    lonRad +
    Math.atan2(
      Math.sin(headingRad) * Math.sin(distance / earthRadius) * Math.cos(latRad),
      Math.cos(distance / earthRadius) - Math.sin(latRad) * Math.sin(newLat)
    );

  // Normalize longitude to be between -180 and 180 degrees
  newLon = ((newLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

  // Convert new latitude and longitude back to degrees
  const newLatDeg = rad2deg(newLat);
  const newLonDeg = rad2deg(newLon);

  return [newLonDeg, newLatDeg];
}
