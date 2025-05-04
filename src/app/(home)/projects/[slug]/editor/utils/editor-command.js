// commands.js
import {
	BoldIcon,
	ItalicIcon,
	UnderlineIcon,
	Strikethrough,
	List,
	ListOrdered,
	CheckSquare,
	Quote,
	Heading1,
	Heading2,
	Heading3,
	Code,
	Braces,
	LinkIcon,
	Highlighter,
	Subscript,
	Superscript,
} from "lucide-react";

export const baseCommands = (editor) => [
	{
		title: "Heading 1",
		subtitle: "Big section heading",
		icon: <Heading1 className="w-5 h-5" />,
		keywords: ["h1", "heading1", "title"],
		command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
	},
	{
		title: "Heading 2",
		subtitle: "Medium section heading",
		icon: <Heading2 className="w-5 h-5" />,
		keywords: ["h2", "heading2"],
		command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
	},
	{
		title: "Heading 3",
		subtitle: "Small section heading",
		icon: <Heading3 className="w-5 h-5" />,
		keywords: ["h3", "heading3"],
		command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
	},
	{
		title: "Bullet List",
		subtitle: "Simple bullet points",
		icon: <List className="w-5 h-5" />,
		keywords: ["ul", "unordered", "list"],
		command: () => editor.chain().focus().toggleBulletList().run(),
	},
	{
		title: "Ordered List",
		subtitle: "Numbered list",
		icon: <ListOrdered className="w-5 h-5" />,
		keywords: ["ol", "ordered", "list"],
		command: () => editor.chain().focus().toggleOrderedList().run(),
	},
	{
		title: "Checklist",
		subtitle: "Tasks with checkboxes",
		icon: <CheckSquare className="w-5 h-5" />,
		keywords: ["todo", "task", "checkbox"],
		command: () => editor.chain().focus().toggleTaskList().run(),
	},
	{
		title: "Blockquote",
		subtitle: "Inset text for quotes",
		icon: <Quote className="w-5 h-5" />,
		keywords: ["quote", "blockquote"],
		command: () => editor.chain().focus().toggleBlockquote().run(),
	},
	{
		title: "Code Block",
		subtitle: "Multi-line code block",
		icon: <Braces className="w-5 h-5" />,
		keywords: ["code", "block"],
		command: () => editor.chain().focus().toggleCodeBlock().run(),
	},
	{
		title: "Inline Code",
		subtitle: "Inline code snippet",
		icon: <Code className="w-5 h-5" />,
		keywords: ["inline", "code"],
		command: () => editor.chain().focus().toggleCode().run(),
	},
	{
		title: "Bold",
		subtitle: "Bold your text",
		icon: <BoldIcon className="w-5 h-5" />,
		keywords: ["bold", "strong"],
		command: () => editor.chain().focus().toggleBold().run(),
	},
	{
		title: "Italic",
		subtitle: "Italicize your text",
		icon: <ItalicIcon className="w-5 h-5" />,
		keywords: ["italic", "em"],
		command: () => editor.chain().focus().toggleItalic().run(),
	},
	{
		title: "Underline",
		subtitle: "Underline your text",
		icon: <UnderlineIcon className="w-5 h-5" />,
		keywords: ["underline"],
		command: () => editor.chain().focus().toggleUnderline().run(),
	},
	{
		title: "Strikethrough",
		subtitle: "Strike through text",
		icon: <Strikethrough className="w-5 h-5" />,
		keywords: ["strike"],
		command: () => editor.chain().focus().toggleStrike().run(),
	},
	{
		title: "Highlight",
		subtitle: "Emphasize with background",
		icon: <Highlighter className="w-5 h-5" />,
		keywords: ["highlight", "bg"],
		command: () => editor.chain().focus().toggleHighlight().run(),
	},
	{
		title: "Subscript",
		subtitle: "Small text below baseline",
		icon: <Subscript className="w-5 h-5" />,
		keywords: ["subscript"],
		command: () => editor.chain().focus().toggleSubscript().run(),
	},
	{
		title: "Superscript",
		subtitle: "Small text above baseline",
		icon: <Superscript className="w-5 h-5" />,
		keywords: ["superscript"],
		command: () => editor.chain().focus().toggleSuperscript().run(),
	},
	{
		title: "Add Link",
		subtitle: "Insert hyperlink",
		icon: <LinkIcon className="w-5 h-5" />,
		keywords: ["link", "url"],
		command: () => {
			const url = window.prompt("Enter the URL");
			if (url) {
				editor
					.chain()
					.focus()
					.setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
					.run();
			}
		},
	},
];
