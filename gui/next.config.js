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
};

module.exports = nextConfig;
