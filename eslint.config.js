import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
	// Base JavaScript rules
	pluginJs.configs.recommended,

	// React rules
	pluginReact.configs.flat.recommended,
	{
		plugins: { "react-hooks": fixupPluginRules(pluginReactHooks) },
		rules: { ...pluginReactHooks.configs.recommended.rules },
	},
	{
		settings: { react: { version: "detect" } },
		rules: {
			"react/react-in-jsx-scope": "off", // React is now in the scope automatically in React 17+
			"react/jsx-uses-react": "error", // Ensures JSX uses React correctly
			"react/jsx-uses-vars": "error", // Ensures JSX uses variables correctly
			"no-undef": "error", // Catch undefined variables
			"no-useless-escape": "off", // Disables unnecessary escape rule
			"react/prop-types": "off", // No need for PropTypes when using TypeScript (for future-proofing)
			"no-unused-vars": "warn", // Warn about unused variables
			"no-var": "warn", // Enforce the use of `let` and `const` instead of `var`
			"react/jsx-no-duplicate-props": "warn", // Warn about duplicate props
			"react/self-closing-comp": "off", // Allows self-closing tags
			"react/no-array-index-key": "warn", // Warn about using array index as keys
			"react/jsx-pascal-case": "warn", // Enforce PascalCase for JSX components
			"react/destructuring-assignment": ["warn", "always"], // Enforce destructuring in JSX props
			"react/no-deprecated": "warn", // Warn on deprecated React methods
			"react/require-render-return": "error", // Ensure `render()` returns a value
			"react-hooks/exhaustive-deps": "warn", // Warn about missing deps in useEffect
			"react/display-name": "off", // Disable display-name rule for anonymous components
		},
	},

	// Next.js rules
	{
		plugins: { "@next/next": nextPlugin },
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
		},
	},

	// Prettier plugin configuration
	{
		plugins: {
			prettier: eslintPluginPrettier,
		},
		rules: {
			"prettier/prettier": [
				"error",
				{
					singleQuote: false,
					useTabs: true,
					tabWidth: 2,
					endOfLine: "auto",
					insertFinalNewline: true,
				},
			],
			quotes: ["error", "double"],
		},
	},

	// Disable ESLint rules that conflict with Prettier
	eslintConfigPrettier,
	{
		rules: {
			indent: ["error", "tab"], // Use tabs for indentation
			"no-tabs": "off", // Allow tabs (disable the no-tabs rule)
		},
	},

	// Include JavaScript & JSX files
	{ files: ["**/*.jsx", "**/*.js"] },

	// Global variables (Node, Browser, Bun)
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
				Bun: "readonly", // If you're using Bun for runtime, mark it as readonly
			},
		},
	},

	// Ignored files & directories
	{
		ignores: [
			".next/", // Ignore Next.js build output
			"node_modules/", // Ignore dependencies
			"dist/", // Ignore build output
			"out/", // Ignore Next.js static export folder
			"coverage/", // Ignore test coverage reports
			"**/*.min.js", // Ignore minified JS files
			"**/vendor/**", // Ignore vendor files
			"**/public/**", // Ignore public assets
		],
	},
];
