/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.public.blob.vercel-storage.com",
				port: "",
			},
		],
	},
	cacheComponents: true,
};

export default nextConfig;
