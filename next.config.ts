import type { NextConfig } from "next";

const backendURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const IsDEV = backendURL.startsWith("http://localhost");

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: IsDEV,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        // pathname: "/media/**",
        // search: "",
      },
      // {
        // protocol: "http",
        // hostname: "127.0.0.1",
        // port: "8000",
        // pathname: "/media/**",
        // search: "",
      // },
    ],
  },
};

export default nextConfig;
