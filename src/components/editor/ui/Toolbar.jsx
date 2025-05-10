"use client";
import {
	Braces,
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	LinkIcon,
	List,
	ListOrdered,
	Quote,
} from "lucide-react";
import {
	Bold as BoldIcon,
	Italic as ItalicIcon,
	Strikethrough,
	Subscript as SubIcon,
	Superscript as SupIcon,
	Underline as UnderlineIcon,
} from "lucide-react";
import { Highlighter } from "lucide-react";

export default function Toolbar({ editor }) {
	if (!editor) return null;

	const fontFamilies = [
		{ name: "Sans Serif", value: "sans-serif" },
		{ name: "Serif", value: "serif" },
		{ name: "Monospace", value: "monospace" },
		{ name: "Inter", value: "Inter, sans-serif" },
		{ name: "Roboto", value: "Roboto, sans-serif" },
		{ name: "Georgia", value: "Georgia, serif" },
		{ name: "Courier", value: "Courier New, monospace" },
	];

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

			<button
				onClick={() => editor.chain().focus().setTextAlign("left").run()}
				className="px-2 py-1 text-sm rounded hover:bg-muted"
			>
				Align Left
			</button>

			<button
				onClick={() => editor.chain().focus().setTextAlign("center").run()}
				className="px-2 py-1 text-sm rounded hover:bg-muted"
			>
				Align Center
			</button>

			<button
				onClick={() => editor.chain().focus().setTextAlign("right").run()}
				className="px-2 py-1 text-sm rounded hover:bg-muted"
			>
				Align Right
			</button>

			<button
				onClick={() => editor.chain().focus().setTextAlign("justify").run()}
				className="px-2 py-1 text-sm rounded hover:bg-muted"
			>
				Justify
			</button>
			<button
				onClick={() => editor.chain().focus().undo().run()}
				className="px-2 py-1 text-sm rounded hover:bg-muted"
				disabled={!editor.can().undo()}
			>
				Undo
			</button>

			<button
				onClick={() => editor.chain().focus().redo().run()}
				className="px-2 py-1 text-sm rounded hover:bg-muted"
				disabled={!editor.can().redo()}
			>
				Redo
			</button>

			<select
				className="px-2 py-1 text-sm border rounded"
				onChange={(e) => {
					editor.chain().focus().setFontFamily(e.target.value).run();
				}}
				value={editor.getAttributes("textStyle").fontFamily || ""}
			>
				<option value="">Font</option>
				{fontFamilies.map((font) => (
					<option
						style={{ fontFamily: font.value }}
						key={font.value}
						value={font.value}
					>
						{font.name}
					</option>
				))}
			</select>
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("bold") ? "bg-muted" : ""
				}`}
				title="Bold (⌘B)"
			>
				<BoldIcon className="w-4 h-4" />
			</button>

			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("italic") ? "bg-muted" : ""
				}`}
				title="Italic (⌘I)"
			>
				<ItalicIcon className="w-4 h-4" />
			</button>

			<button
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("strike") ? "bg-muted" : ""
				}`}
				title="Strikethrough"
			>
				<Strikethrough className="w-4 h-4" />
			</button>

			<button
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("underline") ? "bg-muted" : ""
				}`}
				title="Underline"
			>
				<UnderlineIcon className="w-4 h-4" />
			</button>

			<button
				onClick={() => editor.chain().focus().toggleSubscript().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("subscript") ? "bg-muted" : ""
				}`}
				title="Subscript"
			>
				<SubIcon className="w-4 h-4" />
			</button>

			<button
				onClick={() => editor.chain().focus().toggleSuperscript().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("superscript") ? "bg-muted" : ""
				}`}
				title="Superscript"
			>
				<SupIcon className="w-4 h-4" />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHighlight().run()}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("highlight") ? "bg-yellow-200 text-black" : ""
				}`}
				title="Highlight"
			>
				<Highlighter className="w-4 h-4" />
			</button>
			<button
				onClick={() => {
					const url = window.prompt("Enter the URL");
					if (url) {
						editor
							.chain()
							.focus()
							.setLink({
								href: url,
								target: "_blank",
								rel: "noopener noreferrer",
							})
							.run();
					}
				}}
				className={`p-2 rounded hover:bg-muted ${
					editor.isActive("link") ? "bg-muted" : ""
				}`}
				title="Add Link"
			>
				<LinkIcon className="w-4 h-4" />
			</button>
		</div>
	);
}
