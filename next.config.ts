import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  experimental: {
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    workerThreads: true,
    webpackBuildWorker: true,
  },
};

export default nextConfig;
