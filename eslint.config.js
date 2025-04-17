import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

export default [
	pluginJs.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		plugins: { "react-hooks": fixupPluginRules(pluginReactHooks) },
		rules: { ...pluginReactHooks.configs.recommended.rules },
	},
	{
		settings: { react: { version: "detect" } },
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "error",
			"react/jsx-uses-vars": "error",
			"no-undef": "error",
			"no-useless-escape": "off",
			"react/prop-types": "off",
			"no-unused-vars": "warn",
			"no-var": "warn",
			"react/jsx-no-duplicate-props": "warn",
			"react/self-closing-comp": "off",
			"react/no-array-index-key": "warn",
			"react/jsx-pascal-case": "warn",
			"react/destructuring-assignment": ["warn", "always"],
			"react/no-deprecated": "warn",
			"react/require-render-return": "error",
			"react-hooks/exhaustive-deps": "warn",
			"react/display-name": "off",
		},
	},
	{
		plugins: { "@next/next": nextPlugin },
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
		},
	},
	{ ignores: [".next/*", "node_modules/*"] },
	{ files: ["**/*.jsx", "**/*.js"] },
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
				Bun: "readonly",
			},
		},
	},
];
