import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@handshake/types', '@handshake/config'],
};

export default nextConfig;
