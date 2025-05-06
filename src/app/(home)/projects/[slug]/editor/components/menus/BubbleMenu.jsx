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

/**
 * Main BubbleMenu component
 */
const BubbleMenu = ({ editor }) => {
	const { showColorPanel, setShowColorPanel, handleLinkClick } =
		useBubbleMenu(editor);

	useResetStyles(editor);

	if (!editor) return null;

	return (
		<TiptapBubbleMenu
			editor={editor}
			tippyOptions={{
				duration: 150,
				placement: "top",
				zIndex: 50,
				animation: "fade",
			}}
			className="w-[360px] flex items-center gap-2 px-2 py-2 bg-white border border-gray-200 shadow-xl rounded-xl dark:border-zinc-700 dark:bg-zinc-900"
		>
			{/* Formatting buttons */}
			{FORMAT_BUTTONS.map((button) => (
				<BubbleButton
					key={button.format}
					editor={editor}
					onClick={() => button.command(editor)}
					isActive={editor.isActive(button.format)}
					icon={button.icon}
					title={button.title}
					activeClass={button.activeClass}
				/>
			))}

			{/* Link button */}
			<BubbleButton
				editor={editor}
				onClick={handleLinkClick}
				isActive={editor.isActive("link")}
				icon={Link}
				title="Link"
			/>

			{/* Color picker button */}
			<BubbleButton
				editor={editor}
				onClick={() => setShowColorPanel((prev) => !prev)}
				isActive={showColorPanel}
				activeClass="bg-pink-100 text-pink-600"
				icon={PaintBucket}
				title="Text Color"
			/>

			{/* Color picker panel */}
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

export default React.memo(BubbleMenu);

/**
 * Custom hook for BubbleMenu logic
 */
const useBubbleMenu = (editor) => {
	const [showColorPanel, setShowColorPanel] = useState(false);

	// Handle escape key to clear selection
	useEffect(() => {
		if (!editor) return;

		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				const { to } = editor.state.selection;
				editor.chain().setTextSelection(to).focus().run();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [editor]);

	// Handle link creation
	const handleLinkClick = () => {
		if (!editor) return;

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

	return {
		showColorPanel,
		setShowColorPanel,
		handleLinkClick,
	};
};

/**
 * Reusable BubbleButton component with mark clearing
 */
const BubbleButton = React.memo(
	({
		editor,
		onClick,
		isActive,
		activeClass = "bg-blue-100 text-blue-600",
		icon: Icon,
		title,
	}) => {
		const handleClick = () => {
			if (!editor) return;

			// Apply the formatting command
			onClick();

			// Move cursor to end and clear marks after slight delay
			const { to } = editor.state.selection;
			editor.chain().setTextSelection(to).focus().run();

			setTimeout(() => {
				editor.chain().focus().unsetAllMarks().run();
			}, 50);
		};

		return (
			<button
				type="button"
				onClick={handleClick}
				title={title}
				className={`p-2 rounded-lg transition text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-zinc-800 ${
					isActive ? activeClass : ""
				}`}
				aria-pressed={isActive}
			>
				<Icon className="w-5 h-5" />
			</button>
		);
	}
);

BubbleButton.displayName = "BubbleButton";

/**
 * Formatting button configuration
 */
const FORMAT_BUTTONS = [
	{
		format: "bold",
		icon: Bold,
		title: "Bold",
		command: (editor) => editor.chain().focus().toggleBold().run(),
	},
	{
		format: "italic",
		icon: Italic,
		title: "Italic",
		command: (editor) => editor.chain().focus().toggleItalic().run(),
	},
	{
		format: "underline",
		icon: Underline,
		title: "Underline",
		command: (editor) => editor.chain().focus().toggleUnderline().run(),
	},
	{
		format: "strike",
		icon: Strikethrough,
		title: "Strikethrough",
		command: (editor) => editor.chain().focus().toggleStrike().run(),
	},
	{
		format: "code",
		icon: Code,
		title: "Code",
		command: (editor) => editor.chain().focus().toggleCode().run(),
	},
	{
		format: "highlight",
		icon: Highlighter,
		title: "Highlight",
		command: (editor) => editor.chain().focus().toggleHighlight().run(),
		activeClass: "bg-yellow-100 text-yellow-600",
	},
];

/**
 *
 * reset some weird style state
 */
function useResetStyles(editor) {
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
}
