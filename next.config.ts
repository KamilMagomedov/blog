import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "portfolio.adminstore.top",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  env: {
    NODE_TLS_REJECT_UNAUTHORIZED: "0",
  },
};

export default nextConfig;
