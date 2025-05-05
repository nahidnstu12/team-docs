import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";
import { useEditor, EditorContent } from "@tiptap/react";
import EditorFooter from "./EditorFooter";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import SlashCommandMenu from "./SlashCommandMenu";
import { LinkDialog } from "./LinkDialog";

export default function RTEeditor({ pageId }) {
	const ref = useRef(null);
	const [linkDialogOpen, setLinkDialogOpen] = useState(false);
	const [initialText, setInitialText] = useState("");
	const [initialUrl, setInitialUrl] = useState("");
	const [dialogMode, setDialogMode] = useState("create");

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

	// for link
	useEffect(() => {
		if (!editor) return;

		const handler = (event) => {
			const target = event.target;
			if (target.tagName === "A") {
				event.preventDefault();

				const url = target.getAttribute("href");
				const text = target.textContent;

				setInitialText(text);
				setInitialUrl(url);
				setDialogMode("edit");
				setLinkDialogOpen(true);
			}
		};

		const dom = editor.view.dom;
		dom.addEventListener("click", handler);
		return () => dom.removeEventListener("click", handler);
	}, [editor]);

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
				<LinkDialog
					open={linkDialogOpen}
					onOpenChange={setLinkDialogOpen}
					editor={editor}
					initialText={initialText}
					initialUrl={initialUrl}
					mode={dialogMode}
				/>

				{editor && (
					<SlashCommandMenu
						open={linkDialogOpen}
						onOpenChange={setLinkDialogOpen}
						editor={editor}
						setInitialText={setInitialText}
						setInitialUrl={setInitialUrl}
						setDialogMode={setDialogMode}
					/>
				)}
			</div>
			<input type="hidden" name="content" ref={ref} />
			<EditorFooter editor={editor} />
			<Button type="button" onClick={handleSubmit} className="mt-4">
				Save
			</Button>
		</form>
	);
}
