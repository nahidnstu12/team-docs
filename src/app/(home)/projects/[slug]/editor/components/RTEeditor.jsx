import { editorExtensions } from "@/lib/editor-extensions/editor-extensions";
import { useEditor, EditorContent } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import SlashCommandMenu from "./SlashCommandMenu";
import { LinkDialog } from "./LinkDialog";
import BubbleMenu from "@/components/editor/ui/BubbleMenu";
import { savePageContent } from "../actions/savePageContent";
import { toast } from "sonner";
import { fetchPageContent } from "../actions/fetchPageContent";
import { useProjectStore } from "../../../store/useProjectStore";

export default function RTEeditor({ pageId }) {
	const ref = useRef(null);
	const [pageContent, setPageContent] = useState(null);
	const [linkDialogOpen, setLinkDialogOpen] = useState(false);
	const [initialText, setInitialText] = useState("");
	const [initialUrl, setInitialUrl] = useState("");
	const [dialogMode, setDialogMode] = useState("create");

	const editor = useEditor({
		immediatelyRender: false,
		extensions: editorExtensions,
		autofocus: true,
		content: pageContent,
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
			if (target.dataset.type === "link") {
				event.preventDefault();

				const url = target.dataset.href;
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

	const handleSubmit = useCallback(async () => {
		if (!editor) return;

		// Get the JSON output
		const rawContent = editor.getJSON();

		// Strip functions if any accidentally included
		const content = JSON.parse(JSON.stringify(rawContent));

		const result = await savePageContent({
			pageId,
			content,
		});

		if (result.success) {
			toast.success(result.message);
		} else {
			toast.error(result.message || "Something went wrong");
		}
	}, [editor, pageId]);

	useEffect(() => {
		// Reset page content when page changes to avoid showing stale content
		setPageContent(null);
		
		async function getPageContent() {
			try {
				const res = await fetchPageContent(pageId);
				const content = res.content;
				
				// Only update if we're still on the same page
				if (pageId === useProjectStore.getState().selectedPage) {
					setPageContent(content);
					
					if (editor) {
						if (content) {
							editor.commands.setContent(content);
						} else {
							editor.commands.clearContent();
						}
						editor.commands.focus('end');
					}
				}
			} catch (error) {
				console.error('Error fetching page content:', error);
				toast.error('Failed to load page content');
			}
		}

		getPageContent();
	}, [pageId, editor]);
	
	// We don't need this second effect as it can cause duplicate content setting
	// The first effect now properly handles setting content when either pageId or editor changes

	useEffect(() => {
		if (editor) {
			// Register the save function into Zustand
			useProjectStore.getState().setSaveHandler(handleSubmit);
		}
	}, [editor, handleSubmit]);

	return (
		<form className="w-full mt-6">
			<div className="relative w-full">
				<div
					onClick={() => editor?.commands.focus()}
					className="w-full p-4 px-0 rounded-md cursor-text max-w-none"
				>
					<BubbleMenu editor={editor} />
					<EditorContent editor={editor} className="w-full p-0 min-h-[500px]" />
				</div>

				{/* Link dialog */}
				<LinkDialog
					open={linkDialogOpen}
					onOpenChange={setLinkDialogOpen}
					editor={editor}
					initialText={initialText}
					initialUrl={initialUrl}
					mode={dialogMode}
				/>

				{/* Slash command menu */}
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
		</form>
	);
}
