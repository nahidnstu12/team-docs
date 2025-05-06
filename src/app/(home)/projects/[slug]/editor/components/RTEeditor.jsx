import { useEditorInstance } from "./../hooks/useEditorInstance";
import { useEditorSubmit } from "./../hooks/useEditorSubmit";
import { EditorContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import BubbleMenu from "./menus/BubbleMenu";
import { LinkDialog } from "./menus/LinkDialog";
import EditorFooter from "./ui/EditorFooter";
import SlashCommandMenu from "./menus/SlashCommandMenu";
import { LinkProvider } from "../ctx/LinkProvider";
import { useLinkHandling } from "../hooks/useLinkHandling";

export default function RTEeditor({ pageId }) {
	const { editor, editorRef } = useEditorInstance(pageId);
	const { ref, handleSubmit } = useEditorSubmit(editor);

	if (!editor) return <div>Loading editor...</div>;

	return (
		<LinkProvider>
			<EditorWithProvider
				editor={editor}
				editorRef={editorRef}
				refNode={ref}
				handleSubmit={handleSubmit}
			/>
		</LinkProvider>
	);
}

function EditorWithProvider({ editor, editorRef, refNode, handleSubmit }) {
	useLinkHandling(editor);

	return (
		<form action="/actions/saveDocument" method="POST" className="w-full mt-20">
			<div className="relative w-full">
				<EditorContainer editor={editor} editorRef={editorRef}>
					<BubbleMenu editor={editor} />
					<EditorContent editor={editor} />
				</EditorContainer>

				<LinkDialog editor={editor} />
				<SlashCommandMenu editor={editor} />
			</div>

			<input type="hidden" name="content" ref={refNode} />
			<EditorFooter editor={editor} />
			<Button type="button" onClick={handleSubmit} className="mt-4">
				Save
			</Button>
		</form>
	);
}

const EditorContainer = ({ editor, editorRef, children }) => (
	<div
		onClick={() => editor?.commands.focus()}
		className="border w-full p-4 rounded-md h-[450px] overflow-y-auto scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent scrollbar-thumb-rounded-full cursor-text max-w-none"
		ref={editorRef}
	>
		{children}
	</div>
);
