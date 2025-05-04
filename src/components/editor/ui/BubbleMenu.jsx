"use client";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { PaintBucket } from "lucide-react";
import { useState } from "react";
import ColorPickerPanel from "./ColorPickerPanel";

export default function BubbleMenu({ editor }) {
	const [showColorPanel, setShowColorPanel] = useState(false);

	if (!editor) return null;

	return (
		<TiptapBubbleMenu
			editor={editor}
			tippyOptions={{ duration: 100 }}
			shouldShow={({ editor }) => {
				return (
					editor.isActive("textStyle") ||
					editor.isActive("highlight") ||
					editor.state.selection.content().size > 0
				);
			}}
			className="flex gap-2 p-2 bg-white border rounded-md shadow-md"
		>
			<button
				onClick={() => setShowColorPanel((prev) => !prev)}
				className="p-1 rounded hover:bg-gray-100"
			>
				<PaintBucket className="w-5 h-5 text-gray-700" />
			</button>

			{showColorPanel && (
				<ColorPickerPanel
					editor={editor}
					onClose={() => setShowColorPanel(false)}
				/>
			)}
		</TiptapBubbleMenu>
	);
}
