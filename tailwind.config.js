// tailwind.config.js
import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./node_modules/@heroui/theme/dist/components/(drawer|modal).js",
		"./src/**/*.{js,jsx}", // ✅ Also include your app files if you forgot
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [heroui(), require("tailwindcss-animate")],
};

export default config;
