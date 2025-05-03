import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import { ColorExtensions } from "@/components/editor/extensions/colors";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

export const editorExtensions = [
	StarterKit.configure({
		history: true,
	}),
	// CustomHeading,
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
