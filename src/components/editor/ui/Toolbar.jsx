"use client";
import {
	Braces,
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
} from "lucide-react";

export default function Toolbar({ editor }) {
	if (!editor) return null;

	return (
		<div className="flex flex-wrap gap-2 mb-4">
			<button
				onClick={() => editor.chain().focus().toggleTaskList().run()}
				className="flex items-center gap-1 px-3 py-1 text-sm transition border rounded hover:bg-muted"
			>
				<CheckSquare className="w-4 h-4" />
				Checklist
			</button>

			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className="flex items-center gap-1 px-3 py-1 text-sm transition border rounded hover:bg-muted"
			>
				<List className="w-4 h-4" />
				Bullet List
			</button>

			<button
				onClick={() => editor.chain().focus().toggleOrderedList().run()} // Toggle ordered list
				className="flex items-center gap-1 px-3 py-1 text-sm transition border rounded hover:bg-muted"
			>
				<ListOrdered className="w-4 h-4" /> {/* Numbered List Icon */}
				Ordered List
			</button>

			<button
				type="button"
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
				className="px-2 py-1 text-sm transition rounded-md hover:bg-muted"
			>
				― HR
			</button>

			<button
				onClick={() => {
					if (editor.can().insertDetails()) {
						editor.chain().focus().insertDetails().run();
					}
				}}
				disabled={!editor.can().insertDetails()}
				className={editor.isActive("details") ? "is-active" : ""}
			>
				Add Details
			</button>

			<button
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className="flex items-center gap-1 px-3 py-1 text-sm transition border rounded hover:bg-muted"
			>
				<Quote className="w-4 h-4" />
				Quote
			</button>

			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className="flex items-center gap-1 px-3 py-1 text-sm transition border rounded hover:bg-muted"
			>
				<Heading1 className="w-4 h-4" />
				H1
			</button>

			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className="flex items-center gap-1 px-3 py-1 text-sm transition border rounded hover:bg-muted"
			>
				<Heading2 className="w-4 h-4" />
				H2
			</button>

			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				className="flex items-center gap-1 px-3 py-1 text-sm transition border rounded hover:bg-muted"
			>
				<Heading3 className="w-4 h-4" />
				H3
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCode().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("code") ? "bg-muted" : ""
				}`}
				title="Inline Code (⌘E)"
			>
				<Code className="w-4 h-4" />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("codeBlock") ? "bg-muted" : ""
				}`}
				title="Code Block (⇧⌘C)"
			>
				<Braces className="w-4 h-4" />
			</button>
		</div>
	);
}
