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
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    MAPBOX_STYLE_URL: process.env.MAPBOX_STYLE_URL,
    GUI_SERVER_URL: process.env.GUI_SERVER_URL,
    AUTH_SERVER_URL: process.env.AUTH_SERVER_URL,
    API_SERVER_URL: process.env.API_SERVER_URL,
    API_WS_URL: process.env.API_WS_URL,
  },
};

module.exports = nextConfig;
