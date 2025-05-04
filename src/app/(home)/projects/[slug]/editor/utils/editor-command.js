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
	ListCollapse,
	Minus,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Undo2,
	Redo2,
} from "lucide-react";

export const baseCommands = (editor) => [
	{
		group: "Headings",
		items: [
			{
				title: "Heading 1",
				subtitle: "Big section heading",
				icon: <Heading1 className="w-5 h-5" />,
				keywords: [
					"h1",
					"heading1",
					"title",
					"main heading",
					"section title",
					"big text",
				],
				command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			},
			{
				title: "Heading 2",
				subtitle: "Medium section heading",
				icon: <Heading2 className="w-5 h-5" />,
				keywords: [
					"h2",
					"heading2",
					"subheading",
					"subtitle",
					"medium heading",
				],
				command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			},
			{
				title: "Heading 3",
				subtitle: "Small section heading",
				icon: <Heading3 className="w-5 h-5" />,
				keywords: [
					"h3",
					"heading3",
					"small title",
					"subsection",
					"minor heading",
				],
				command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			},
		],
	},
	{
		group: "Lists",
		items: [
			{
				title: "Bullet List",
				subtitle: "Simple bullet points",
				icon: <List className="w-5 h-5" />,
				keywords: [
					"ul",
					"unordered",
					"bullet list",
					"points",
					"bullets",
					"items",
				],
				command: () => editor.chain().focus().toggleBulletList().run(),
			},
			{
				title: "Ordered List",
				subtitle: "Numbered list",
				icon: <ListOrdered className="w-5 h-5" />,
				keywords: [
					"ol",
					"ordered",
					"number list",
					"sequence",
					"steps",
					"ranked",
				],
				command: () => editor.chain().focus().toggleOrderedList().run(),
			},
			{
				title: "Checklist",
				subtitle: "Tasks with checkboxes",
				icon: <CheckSquare className="w-5 h-5" />,
				keywords: ["todo", "task", "checkbox", "checklist", "tasks", "done"],
				command: () => editor.chain().focus().toggleTaskList().run(),
			},
		],
	},
	{
		group: "Blocks",
		items: [
			{
				title: "Blockquote",
				subtitle: "Inset text for quotes",
				icon: <Quote className="w-5 h-5" />,
				keywords: ["quote", "blockquote", "quote block", "inset", "citation"],
				command: () => editor.chain().focus().toggleBlockquote().run(),
			},
			{
				title: "Code Block",
				subtitle: "Multi-line code block",
				icon: <Braces className="w-5 h-5" />,
				keywords: [
					"code",
					"codeblock",
					"pre",
					"syntax",
					"developer",
					"snippet",
				],
				command: () => editor.chain().focus().toggleCodeBlock().run(),
			},
			{
				title: "Details",
				subtitle: "Toggle Details",
				icon: <ListCollapse className="w-5 h-5" />,
				keywords: ["details", "toggle", "summary", "story"],
				command: () => editor.chain().focus().insertDetails().run(),
			},
		],
	},
	{
		group: "Inline",
		items: [
			{
				title: "Inline Code",
				subtitle: "Inline code snippet",
				icon: <Code className="w-5 h-5" />,
				keywords: ["inline code", "snippet", "code inline", "dev"],
				command: () => editor.chain().focus().toggleCode().run(),
			},
			{
				title: "Add Link",
				subtitle: "Insert hyperlink",
				icon: <LinkIcon className="w-5 h-5" />,
				keywords: ["link", "url", "hyperlink", "anchor", "external"],
				command: () => {
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
				},
			},
		],
	},
	{
		group: "Formatting",
		items: [
			{
				title: "Bold",
				subtitle: "Bold your text",
				icon: <BoldIcon className="w-5 h-5" />,
				keywords: ["bold", "strong", "emphasis", "weight", "b"],
				command: () => editor.chain().focus().toggleBold().run(),
			},
			{
				title: "Italic",
				subtitle: "Italicize your text",
				icon: <ItalicIcon className="w-5 h-5" />,
				keywords: ["italic", "em", "slanted", "i"],
				command: () => editor.chain().focus().toggleItalic().run(),
			},
			{
				title: "Underline",
				subtitle: "Underline your text",
				icon: <UnderlineIcon className="w-5 h-5" />,
				keywords: ["underline", "u", "underscore", "highlight line"],
				command: () => editor.chain().focus().toggleUnderline().run(),
			},
			{
				title: "Strikethrough",
				subtitle: "Strike through text",
				icon: <Strikethrough className="w-5 h-5" />,
				keywords: ["strike", "strikethrough", "line through", "remove"],
				command: () => editor.chain().focus().toggleStrike().run(),
			},
			{
				title: "Highlight",
				subtitle: "Emphasize with background",
				icon: <Highlighter className="w-5 h-5" />,
				keywords: ["highlight", "background", "emphasis", "marker"],
				command: () => editor.chain().focus().toggleHighlight().run(),
			},
			{
				title: "Subscript",
				subtitle: "Small text below baseline",
				icon: <Subscript className="w-5 h-5" />,
				keywords: ["subscript", "lower text", "chemical", "math"],
				command: () => editor.chain().focus().toggleSubscript().run(),
			},
			{
				title: "Superscript",
				subtitle: "Small text above baseline",
				icon: <Superscript className="w-5 h-5" />,
				keywords: ["superscript", "upper text", "power", "math"],
				command: () => editor.chain().focus().toggleSuperscript().run(),
			},
			{
				title: "Divider",
				subtitle: "put a divider",
				icon: <Minus className="w-5 h-5" />,
				keywords: ["line", "break", "horizontal", "divider"],
				command: () => editor.chain().focus().setHorizontalRule().run(),
			},
		],
	},

	{
		group: "Text Alignment",
		items: [
			{
				title: "Align Left",
				subtitle: "Align text to the left",
				icon: <AlignLeft className="w-5 h-5" />,
				keywords: ["left", "align left", "text left", "flush left"],
				command: () => editor.chain().focus().setTextAlign("left").run(),
			},
			{
				title: "Align Center",
				subtitle: "Center align text",
				icon: <AlignCenter className="w-5 h-5" />,
				keywords: ["center", "align center", "text center", "middle"],
				command: () => editor.chain().focus().setTextAlign("center").run(),
			},
			{
				title: "Align Right",
				subtitle: "Align text to the right",
				icon: <AlignRight className="w-5 h-5" />,
				keywords: ["right", "align right", "text right", "flush right"],
				command: () => editor.chain().focus().setTextAlign("right").run(),
			},
			{
				title: "Justify",
				subtitle: "Justify text alignment",
				icon: <AlignJustify className="w-5 h-5" />,
				keywords: ["justify", "align justify", "full justify", "even"],
				command: () => editor.chain().focus().setTextAlign("justify").run(),
			},
		],
	},
	{
		group: "Operations",
		items: [
			{
				title: "Undo",
				subtitle: "Undo last action",
				icon: <Undo2 className="w-5 h-5" />,
				keywords: ["undo", "reverse", "back", "step back"],
				command: () => editor.chain().focus().undo().run(),
			},
			{
				title: "Redo",
				subtitle: "Redo last undone action",
				icon: <Redo2 className="w-5 h-5" />,
				keywords: ["redo", "repeat", "forward", "step forward"],
				command: () => editor.chain().focus().redo().run(),
			},
		],
	},
];
