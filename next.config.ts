import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    let rawApiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://profilebackendapi.ashyshop.com/api/v1";
    if (rawApiUrl.includes("nadib.ashyshop.com") || rawApiUrl.includes("localhost:3000")) {
      rawApiUrl = "https://profilebackendapi.ashyshop.com/api/v1";
    }
    const cleanApiUrl = rawApiUrl.replace(/\/+$/, "");
    return [
      {
        source: "/api/v1/:path*",
        destination: `${cleanApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
