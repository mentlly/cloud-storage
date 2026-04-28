import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // This allows the HMR (Hot Module Replacement) to work over your local IP
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  allowedDevOrigins: ['192.168.1.*'],
};

export default nextConfig;
