/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "api.kwiseworld.com",
				// pathname: ""
			},
		],
	},

};

export default nextConfig;
