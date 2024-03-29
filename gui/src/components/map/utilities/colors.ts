import { createHash } from "crypto";
export function generateColorDictionary(inputSet: Set<string>): { [key: string]: string } {
  const keysArray = Array.from(inputSet).sort(); // Sort the keysArray
  const colorDictionary: { [key: string]: string } = {};

  keysArray.forEach((key) => {
    const hash = createHash("md5").update(key).digest("hex"); // Generate a hash for each key
    const color = `#${hash.slice(0, 6)}`; // Use the first 6 characters of the hash as the color
    colorDictionary[key] = color;
  });

  return colorDictionary;
}

export function generateMapboxStyleExpression(colors: { [key: string]: string }): mapboxgl.Expression {
  const layerStyle: mapboxgl.Expression = ["match", ["get", "id"]];
  for (const [key, value] of Object.entries(colors)) {
    layerStyle.push(key);
    layerStyle.push(value);
  }
  layerStyle.push("#000000"); // other
  return layerStyle;
}
