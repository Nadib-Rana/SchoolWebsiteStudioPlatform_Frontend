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
    const rawApiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000/api/v1";
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
