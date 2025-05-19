/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./src/**/*.{js,jsx}", // ✅ App source files
	],
	theme: {
		extend: {},
	},
	darkMode: "class", // ✅ for dark mode support
	plugins: [require("tailwindcss-animate")], // ✅ ShadCN-compatible animation plugin
};

export default config;
