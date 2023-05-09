/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false,
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tst$/,
      use: "raw-loader",
    });
    return config;
  },
  // all visible runtime environment variables must be added here
  publicRuntimeConfig: {
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
    DOCKER_HOST_IP: process.env.DOCKER_HOST_IP,
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  },
};

module.exports = nextConfig;
