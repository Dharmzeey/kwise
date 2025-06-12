import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				hostname: "kwise-api.dharmzeey.com",
			}
		]
	},

};

export default nextConfig;