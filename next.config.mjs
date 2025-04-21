/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: false,
	experimental: {
		authInterrupts: true,
	},
};

export default nextConfig;
