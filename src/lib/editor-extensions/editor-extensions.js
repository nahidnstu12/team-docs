import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { ColorExtensions } from "@/components/editor/extensions/color";
import OrderedList from "@tiptap/extension-ordered-list";
import {
	Details,
	DetailsSummary,
} from "@/components/editor/extensions/details";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import FontFamily from "@tiptap/extension-font-family";
import CharacterCount from "@tiptap/extension-character-count";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import { CustomLink } from "@/components/editor/extensions/link";
import { ClearMarksOnEnter } from "@/components/editor/extensions/clearMarkStyles";
import { ResetMarksOnDelete } from "@/components/editor/extensions/ResetMarksOnDelete";

const lowlight = createLowlight(all);

export const editorExtensions = [
	StarterKit.configure({
		history: true,
		// Ensure `TextAlign` can override paragraphs, headings, etc.
		paragraph: { HTMLAttributes: { class: "text-left" } },
		heading: { HTMLAttributes: { class: "text-left" } },
	}),
	TaskList.configure({
		nested: true,
	}),
	TaskItem.configure({
		nested: true,
	}),
	CodeBlockLowlight.configure({
		lowlight,
	}),
	OrderedList.configure({}),
	Details,
	DetailsSummary,
	TextAlign.configure({
		types: ["heading", "paragraph"], // Specify which node types to align
	}),
	Typography,
	FontFamily.configure({
		types: ["textStyle"],
	}),
	CharacterCount.configure({
		limit: 10_000, // Optional: max limit
	}),
	Bold,
	Italic,
	Strike,
	Underline,
	Subscript,
	Superscript,
	Highlight,
	CustomLink, // create custome link. store link in span
	ClearMarksOnEnter, // prevent style to carry to next line (mark style)
	ResetMarksOnDelete, // reset stored mark style for the same line
	...ColorExtensions,
];
