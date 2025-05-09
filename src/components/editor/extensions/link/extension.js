// editor/extensions/link-extension.js
import { Link } from "@tiptap/extension-link";

export const CustomLink = Link.extend({
	renderHTML({ HTMLAttributes }) {
		return [
			"span",
			{
				...HTMLAttributes,
				"data-type": "link",
				"data-href": HTMLAttributes.href,
				class: "custom-link cursor-pointer text-blue-500 underline",
			},
			0,
		];
	},
});
