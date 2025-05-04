import BubbleMenu from "@/components/editor/ui/BubbleMenu";
import Toolbar from "@/components/editor/ui/Toolbar";
import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";
import { useEditor, EditorContent } from "@tiptap/react";
import EditorFooter from "./EditorFooter";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function RTEeditor() {
	const ref = useRef(null);

	const editor = useEditor({
		extensions: editorExtensions,
		autofocus: true,
		editorProps: {
			attributes: {
				class: "focus:outline-none max-w-none",
			},
		},
	});

	const handleSubmit = () => {
		if (!editor) return;

		const content = JSON.stringify(editor.getJSON());
		ref.current.value = content;
		ref.current.form.requestSubmit();
	};

	return (
		// <div className="w-full p-6 space-y-4">
		// 	<Toolbar editor={editor} />
		// 	<EditorContent
		// 		editor={editor}
		// 		className="space-y-2 focus:outline-none max-w-none"
		// 	/>
		// 	<BubbleMenu editor={editor} />
		// 	<EditorFooter editor={editor} />
		// </div>

		<form action="/actions/saveDocument" method="POST" className="w-full mt-20">
			<div className="relative w-full">
				<div
					onClick={() => editor?.commands.focus()}
					className="border w-full p-4 rounded-md h-[450px] overflow-y-auto scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent scrollbar-thumb-rounded-full cursor-text prose prose-sm max-w-none"
				>
					<EditorContent
						editor={editor}
						className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus-visible:ring-0 w-full max-w-none border-0 p-0 min-h-[400px]"
						style={{ lineHeight: "1.2" }}
					/>
				</div>
				{/* <RTEslash editor={editor} /> */}
			</div>
			<input type="hidden" name="content" ref={ref} />
			<EditorFooter editor={editor} />
			<Button type="button" onClick={handleSubmit} className="mt-4">
				Save
			</Button>
		</form>
	);
}
