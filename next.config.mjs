/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: false,
	watchOptions: {
		ignored: ["**/.git/**", "**/.next/**", "**/node_modules/**"],
	},
};

export default nextConfig;
