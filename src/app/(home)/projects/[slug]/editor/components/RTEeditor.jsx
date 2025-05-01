import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import RTEslash from "./RTEslash";
import { Button } from "@/components/ui/button";

export default function RTEeditor({ pageId, initialContent }) {
	const ref = useRef(null);

	const editor = useEditor({
		extensions: [StarterKit, Bold, Italic, Heading],
		content: initialContent,
	});

	const handleSubmit = () => {
		if (!editor) return;

		const content = JSON.stringify(editor.getJSON());
		ref.current.value = content;
		ref.current.form.requestSubmit();
	};
	return (
		<form action="/actions/saveDocument" method="POST" className="w-full">
			<div className="relative w-full">
				{" "}
				{/* Added relative positioning */}
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
				<RTEslash editor={editor} className="absolute z-10 bottom-4 right-4" />{" "}
				{/* Positioned the slash command */}
			</div>
			<input type="hidden" name="content" ref={ref} />
			<Button type="button" onClick={handleSubmit} className="mt-4">
				Save
			</Button>
		</form>
	);
}
