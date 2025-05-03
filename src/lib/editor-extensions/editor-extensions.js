import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { ColorExtensions } from "@/components/editor/extensions/color";

const lowlight = createLowlight(all);

export const editorExtensions = [
	StarterKit.configure({
		history: true,
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
	...ColorExtensions,
];
