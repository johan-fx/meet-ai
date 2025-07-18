import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  devIndicators: {
    position: "bottom-right",
  },
  allowedDevOrigins:
    process.env.NODE_ENV !== "production"
      ? [process.env.NGROK_PUBLIC_DOMAIN ?? ""]
      : [],
};

export default withNextIntl(nextConfig);
