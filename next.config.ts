import type { NextConfig } from "next";

import withRspack from "next-rspack";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  turbopack: {

    resolveAlias: {
      "@": "./src",
      "@/components": "./src/components",
      "@/lib": "./src/lib",
      "@/styles": "./src/styles",
      "@/store": "./src/store",
      "@/types": "./src/types",
      "@/utils": "./src/utils",
      "@/hooks": "./src/hooks",
      "@/app": "./src/app",
      "@/pages": "./src/pages",
      "@/public": "./public",
    },
    resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      os: false,
      module: false,
    };
    return config;
  },
  experimental: {},
};

export default withRspack(nextConfig);
