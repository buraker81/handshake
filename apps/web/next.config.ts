import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@handshake/types", "siwe"],
  webpack: (config) => {
    // @wagmi/connectors resolves @base-org/account with 'node' condition → index.node.js
    // which imports from ox with ESM exports webpack can't analyze.
    // Force browser entry to avoid the broken node build.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@base-org/account": path.resolve(
        __dirname,
        "../../node_modules/.pnpm/@base-org+account@2.4.0_@types+react@19.2.14_bufferutil@4.1.0_react@19.2.4_typescript@5_7fcec0002321393155f030f08ff64057/node_modules/@base-org/account/dist/index.js"
      ),
    };
    return config;
  },
};

export default nextConfig;
