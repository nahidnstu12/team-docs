import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";

export const ColorExtensions = [
	TextStyle,
	Color,
	Highlight.configure({ multicolor: true }),
];
