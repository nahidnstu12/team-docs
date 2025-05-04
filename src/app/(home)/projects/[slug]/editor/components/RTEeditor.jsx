import BubbleMenu from "@/components/editor/ui/BubbleMenu";
import Toolbar from "@/components/editor/ui/Toolbar";
import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";
import { useEditor, EditorContent } from "@tiptap/react";

export default function RTEeditor() {
	const editor = useEditor({
		extensions: editorExtensions,
		autofocus: true,
		editorProps: {
			attributes: {
				class: "focus:outline-none max-w-none",
			},
		},
	});

	return (
		<div className="w-full p-6 space-y-4">
			<Toolbar editor={editor} />
			<EditorContent
				editor={editor}
				className="space-y-2 focus:outline-none max-w-none"
			/>
			<BubbleMenu editor={editor} />
		</div>
	);
}
