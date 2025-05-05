import { useEditorInstance } from "./../hooks/useEditorInstance";
import { useLinkHandling } from "./../hooks/useLinkHandling";
import { useEditorSubmit } from "./../hooks/useEditorSubmit";
import { EditorContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import BubbleMenu from "./menus/BubbleMenu";
import { LinkDialog } from "./menus/LinkDialog";
import EditorFooter from "./ui/EditorFooter";
import SlashCommandMenu from "./menus/SlashCommandMenu";

export default function RTEeditor({ pageId }) {
	const { editor, editorRef } = useEditorInstance(pageId);
	const {
		linkDialogOpen,
		setLinkDialogOpen,
		initialText,
		setInitialText,
		initialUrl,
		setInitialUrl,
		dialogMode,
		setDialogMode,
	} = useLinkHandling(editor);
	const { ref, handleSubmit } = useEditorSubmit(editor);

	if (!editor) return <div>Loading editor...</div>;

	return (
		<form action="/actions/saveDocument" method="POST" className="w-full mt-20">
			<div className="relative w-full">
				<EditorContainer editor={editor} editorRef={editorRef}>
					<BubbleMenu editor={editor} />
					<EditorContent editor={editor} />
				</EditorContainer>

				<LinkDialog
					open={linkDialogOpen}
					onOpenChange={setLinkDialogOpen}
					editor={editor}
					initialText={initialText}
					initialUrl={initialUrl}
					mode={dialogMode}
				/>

				<SlashCommandMenu
					open={linkDialogOpen}
					onOpenChange={setLinkDialogOpen}
					editor={editor}
					setInitialText={setInitialText}
					setInitialUrl={setInitialUrl}
					setDialogMode={setDialogMode}
				/>
			</div>

			<input type="hidden" name="content" ref={ref} />
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
