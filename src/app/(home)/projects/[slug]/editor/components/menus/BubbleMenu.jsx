import React, { useEffect, useState } from "react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";

import {
	Bold,
	Italic,
	Underline,
	Strikethrough,
	Code,
	Highlighter,
	Link,
	PaintBucket,
} from "lucide-react";
import ColorPickerPanel from "@/components/editor/ui/ColorPickerPanel";

const BubbleButton = ({
	editor,
	onClick,
	isActive,
	activeClass = "bg-blue-100 text-blue-600",
	icon: Icon,
	title,
}) => {
	const handleClick = () => {
		// Step 1: Apply the formatting command
		onClick();

		// Step 2: Move cursor to the end of the selection (deselect text)
		const { to } = editor.state.selection;
		editor.chain().setTextSelection(to).focus().run();

		// Step 3: Use a short delay to allow the DOM to update
		setTimeout(() => {
			editor
				.chain()
				.focus()
				.unsetBold()
				.unsetItalic()
				.unsetUnderline()
				.unsetStrike()
				.unsetCode()
				.unsetHighlight()
				.unsetLink()
				.run();
		}, 0); // Delay to avoid interrupting the style being applied
	};

	useEffect(() => {
		if (!editor) return;

		const handleUpdate = () => {
			const { state } = editor;
			const isEmpty = state.doc.content.size === 0;
			const isSelectionEmpty = state.selection.empty;

			if (isEmpty || isSelectionEmpty) {
				editor
					.chain()
					.focus()
					.unsetBold()
					.unsetItalic()
					.unsetUnderline()
					.unsetStrike()
					.unsetCode()
					.unsetHighlight()
					.unsetLink()
					.run();
			}
		};

		editor.on("update", handleUpdate);

		return () => editor.off("update", handleUpdate);
	}, [editor]);

	return (
		<button
			type="button"
			onClick={handleClick}
			title={title}
			className={`p-2 rounded-lg transition text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-zinc-800 ${
				isActive ? activeClass : ""
			}`}
		>
			<Icon className="w-5 h-5" />
		</button>
	);
};

export const BubbleMenu = ({ editor }) => {
	const [showColorPanel, setShowColorPanel] = useState(false);

	useEffect(() => {
		if (!editor) return;

		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				// Clear text selection to hide bubble menu
				const { to } = editor.state.selection;
				editor.chain().setTextSelection(to).focus().run();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [editor]);

	if (!editor) return null;

	const handleLinkClick = () => {
		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("Enter URL", previousUrl);
		if (url) {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url })
				.run();
		}
	};

	return (
		<TiptapBubbleMenu
			editor={editor}
			tippyOptions={{ duration: 150, placement: "top" }}
			className="w-[360px] z-50 flex items-center gap-2 px-2 py-2 bg-white border border-gray-200 shadow-xl rounded-xl dark:border-zinc-700 dark:bg-zinc-900"
		>
			{/* Bold */}
			<BubbleButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleBold().run()}
				isActive={editor.isActive("bold")}
				icon={Bold}
				title="Bold"
			/>

			{/* Italic */}
			<BubbleButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleItalic().run()}
				isActive={editor.isActive("italic")}
				icon={Italic}
				title="Italic"
			/>

			{/* Underline */}
			<BubbleButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				isActive={editor.isActive("underline")}
				icon={Underline}
				title="Underline"
			/>

			{/* Strikethrough */}
			<BubbleButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleStrike().run()}
				isActive={editor.isActive("strike")}
				icon={Strikethrough}
				title="Strikethrough"
			/>

			{/* Inline Code */}
			<BubbleButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleCode().run()}
				isActive={editor.isActive("code")}
				icon={Code}
				title="Code"
			/>

			{/* Highlight */}
			<BubbleButton
				editor={editor}
				onClick={() => editor.chain().focus().toggleHighlight().run()}
				isActive={editor.isActive("highlight")}
				activeClass="bg-yellow-100 text-yellow-600"
				icon={Highlighter}
				title="Highlight"
			/>

			{/* Link */}
			<BubbleButton
				editor={editor}
				onClick={handleLinkClick}
				isActive={editor.isActive("link")}
				icon={Link}
				title="Link"
			/>

			{/* Color Picker */}
			<BubbleButton
				editor={editor}
				onClick={() => setShowColorPanel((prev) => !prev)}
				isActive={showColorPanel}
				activeClass="bg-pink-100 text-pink-600"
				icon={PaintBucket}
				title="Text Color"
			/>

			{/* Color Picker Panel */}
			{showColorPanel && (
				<div className="absolute left-0 z-50 top-12">
					<ColorPickerPanel
						editor={editor}
						onClose={() => setShowColorPanel(false)}
					/>
				</div>
			)}
		</TiptapBubbleMenu>
	);
};

export default BubbleMenu;
