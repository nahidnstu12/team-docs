import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";
import { useEditor, EditorContent } from "@tiptap/react";
import EditorFooter from "./EditorFooter";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import SlashCommandMenu from "./SlashCommandMenu";

export default function RTEeditor({ pageId }) {
	const ref = useRef(null);

	const editor = useEditor({
		immediatelyRender: false,
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

	const handleSubmit = () => {
		if (!editor) return;

		const content = JSON.stringify(editor.getJSON());
		ref.current.value = content;
		ref.current.form.requestSubmit();
	};

	return (
		<form action="/actions/saveDocument" method="POST" className="w-full mt-20">
			<div className="relative w-full">
				<div
					onClick={() => editor?.commands.focus()}
					className="border w-full p-4 rounded-md h-[450px] overflow-y-auto scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent scrollbar-thumb-rounded-full cursor-text max-w-none"
				>
					<EditorContent
						editor={editor}
						className="w-full max-w-none border-0 p-0 min-h-[400px]"
					/>
				</div>
				{editor && <SlashCommandMenu editor={editor} />}
			</div>
			<input type="hidden" name="content" ref={ref} />
			<EditorFooter editor={editor} />
			<Button type="button" onClick={handleSubmit} className="mt-4">
				Save
			</Button>
		</form>
	);
}
