import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
