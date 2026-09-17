import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Parallel static page generation — effective with Turbopack (Next.js 16 default bundler)
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
    // Cloudflare Pages never preserves .next/cache between builds; skip writing it
    turbopackFileSystemCacheForBuild: process.env.CF_PAGES !== "1",
  },
};

export default nextConfig;
