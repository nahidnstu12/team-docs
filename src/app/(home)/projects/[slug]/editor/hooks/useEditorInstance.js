import { useEffect, useRef } from "react";
import { useEditor } from "@tiptap/react";
import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";

export const useEditorInstance = (pageId) => {
	const editorRef = useRef(null);
	const editor = useEditor({
		extensions: editorExtensions,
		autofocus: true,
		editorProps: {
			attributes: {
				class: "focus:outline-none max-w-none",
			},
		},
	});

	useEffect(() => {
		if (editor) {
			editor.commands.focus("end");
		}
	}, [editor, pageId]);

	return { editor, editorRef };
};
