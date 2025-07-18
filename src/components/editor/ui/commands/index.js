/**
 * Editor Commands
 * Centralized command definitions for slash menu and shortcuts
 *
 * @fileoverview This module provides command definitions for the editor's
 * slash menu system, organized by categories with icons, shortcuts, and keywords.
 */

import React from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Braces,
  Link,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Type as TextIcon,
  ListCollapse,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
} from "lucide-react";

/**
 * Get base commands for the slash menu
 * @param {Object} editor - TipTap editor instance
 * @param {Function} onOpenChange - Dialog state change handler
 * @param {Function} setInitialText - Set initial text for link dialog
 * @param {Function} setInitialUrl - Set initial URL for link dialog
 * @param {Function} setDialogMode - Set dialog mode
 * @returns {Array} Array of command groups
 */
export const getBaseCommands = (
  editor,
  onOpenChange,
  setInitialText,
  setInitialUrl,
  setDialogMode
) => [
  {
    group: "Headings",
    items: [
      {
        title: "Heading 1",
        subtitle: "Big section heading",
        icon: <Heading1 className="w-5 h-5" />,
        shortcut: "#",
        keywords: ["h1", "heading1", "title", "main heading", "section title", "big text"],
        command: () => {
          editor.chain().toggleHeading({ level: 1 }).run();
        },
      },
      {
        title: "Heading 2",
        subtitle: "Medium section heading",
        icon: <Heading2 className="w-5 h-5" />,
        shortcut: "##",
        keywords: ["h2", "heading2", "subheading", "subtitle", "medium heading"],
        command: () => {
          editor.chain().toggleHeading({ level: 2 }).run();
        },
      },
      {
        title: "Heading 3",
        subtitle: "Small section heading",
        icon: <Heading3 className="w-5 h-5" />,
        shortcut: "###",
        keywords: ["h3", "heading3", "small heading", "subsection"],
        command: () => {
          editor.chain().toggleHeading({ level: 3 }).run();
        },
      },
    ],
  },
  {
    group: "Lists",
    items: [
      {
        title: "Bullet List",
        subtitle: "Create a simple bullet list",
        icon: <List className="w-5 h-5" />,
        shortcut: "-",
        keywords: ["bullet", "list", "unordered", "ul", "bullets", "items"],
        command: () => editor.chain().toggleBulletList().run(),
      },
      {
        title: "Numbered List",
        subtitle: "Create a numbered list",
        icon: <ListOrdered className="w-5 h-5" />,
        shortcut: "1.",
        keywords: ["numbered", "ordered", "list", "ol", "numbers", "sequence"],
        command: () => editor.chain().toggleOrderedList().run(),
      },
      {
        title: "Task List",
        subtitle: "Track tasks with checkboxes",
        icon: <CheckSquare className="w-5 h-5" />,
        shortcut: "[]",
        keywords: ["task", "todo", "checkbox", "checklist", "tasks", "check"],
        command: () => editor.chain().toggleTaskList().run(),
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
        shortcut: ">",
        keywords: ["quote", "blockquote", "quote block", "inset", "citation"],
        command: () => editor.chain().toggleBlockquote().run(),
      },
      {
        title: "Code Block",
        subtitle: "Multi-line code block",
        icon: <Braces className="w-5 h-5" />,
        shortcut: "```",
        keywords: ["code", "codeblock", "pre", "syntax", "developer", "snippet"],
        command: () => editor.chain().toggleCodeBlock().run(),
      },
      {
        title: "Toggle",
        subtitle: "Collapsible content block",
        icon: <ListCollapse className="w-5 h-5" />,
        keywords: ["toggle", "collapsible", "dropdown", "accordion", "fold", "expand", "collapse"],
        command: () => editor.chain().insertToggle().run(),
      },
    ],
  },
  // {
  //   group: "Media & Links",
  //   items: [
  //     {
  //       title: "Link",
  //       subtitle: "Add a link to text",
  //       icon: <Link className="w-5 h-5" />,
  //       keywords: ["link", "url", "href", "anchor", "reference"],
  //       command: () => {
  //         const selectedText = editor.state.doc.textBetween(
  //           editor.state.selection.from,
  //           editor.state.selection.to
  //         );
  //
  //         setInitialText(selectedText || "");
  //         setInitialUrl("");
  //         setDialogMode("create");
  //         onOpenChange(true);
  //       },
  //     },
  //   ],
  // },
  {
    group: "Formatting",
    items: [
      {
        title: "Text",
        subtitle: "Paragraph style text",
        icon: <TextIcon className="w-5 h-5" />,
        keywords: ["text", "paragraph", "normal", "body", "remove heading"],
        command: () => editor.chain().clearNodes().setParagraph().run(),
      },
      // {
      //   title: "Bold",
      //   subtitle: "Bold your text",
      //   icon: <BoldIcon className="w-5 h-5" />,
      //   shortcut: "⌘B",
      //   keywords: ["bold", "strong", "emphasis", "weight", "b"],
      //   command: () => editor.chain().focus().toggleBold().run(),
      // },
      // {
      //   title: "Italic",
      //   subtitle: "Italicize your text",
      //   icon: <ItalicIcon className="w-5 h-5" />,
      //   shortcut: "⌘I",
      //   keywords: ["italic", "em", "slanted", "i"],
      //   command: () => editor.chain().focus().toggleItalic().run(),
      // },
      // {
      //   title: "Underline",
      //   subtitle: "Underline your text",
      //   icon: <UnderlineIcon className="w-5 h-5" />,
      //   shortcut: "⌘U",
      //   keywords: ["underline", "u", "underlined"],
      //   command: () => editor.chain().focus().toggleUnderline().run(),
      // },
      // {
      //   title: "Strikethrough",
      //   subtitle: "Cross out your text",
      //   icon: <Strikethrough className="w-5 h-5" />,
      //   shortcut: "⌘⇧X",
      //   keywords: ["strikethrough", "strike", "cross", "delete", "remove"],
      //   command: () => editor.chain().focus().toggleStrike().run(),
      // },
      // {
      //   title: "Highlight",
      //   subtitle: "Highlight your text",
      //   icon: <Highlighter className="w-5 h-5" />,
      //   shortcut: "⌘⇧H",
      //   keywords: ["highlight", "mark", "marker", "yellow", "background"],
      //   command: () => editor.chain().focus().toggleHighlight().run(),
      // },
      // {
      //   title: "Inline Code",
      //   subtitle: "Monospace text",
      //   icon: <Code className="w-5 h-5" />,
      //   shortcut: "`",
      //   keywords: ["code", "inline", "monospace", "backtick", "mono"],
      //   command: () => editor.chain().focus().toggleCode().run(),
      // },
    ],
  },
  {
    group: "Alignment",
    items: [
      {
        title: "Align Left",
        subtitle: "Align text to the left",
        icon: <AlignLeft className="w-5 h-5" />,
        keywords: ["align", "left", "alignment", "justify"],
        command: () => editor.chain().setTextAlign("left").run(),
      },
      {
        title: "Align Center",
        subtitle: "Center align text",
        icon: <AlignCenter className="w-5 h-5" />,
        keywords: ["align", "center", "middle", "alignment"],
        command: () => editor.chain().setTextAlign("center").run(),
      },
      {
        title: "Align Right",
        subtitle: "Align text to the right",
        icon: <AlignRight className="w-5 h-5" />,
        keywords: ["align", "right", "alignment"],
        command: () => editor.chain().setTextAlign("right").run(),
      },
      {
        title: "Justify",
        subtitle: "Justify text alignment",
        icon: <AlignJustify className="w-5 h-5" />,
        keywords: ["align", "justify", "full", "alignment"],
        command: () => editor.chain().setTextAlign("justify").run(),
      },
    ],
  },
  {
    group: "Actions",
    items: [
      {
        title: "Undo",
        subtitle: "Undo last action",
        icon: <Undo className="w-5 h-5" />,
        shortcut: "⌘Z",
        keywords: ["undo", "revert", "back", "previous"],
        command: () => editor.chain().undo().run(),
      },
      {
        title: "Redo",
        subtitle: "Redo last action",
        icon: <Redo className="w-5 h-5" />,
        shortcut: "⌘Y",
        keywords: ["redo", "forward", "next", "repeat"],
        command: () => editor.chain().redo().run(),
      },
    ],
  },
];

/**
 * Get commands by category
 * @param {string} category - Command category
 * @param {Object} editor - TipTap editor instance
 * @param {Function} onOpenChange - Dialog state change handler
 * @param {Function} setInitialText - Set initial text for link dialog
 * @param {Function} setInitialUrl - Set initial URL for link dialog
 * @param {Function} setDialogMode - Set dialog mode
 * @returns {Array} Array of commands in the category
 */
export const getCommandsByCategory = (
  category,
  editor,
  onOpenChange,
  setInitialText,
  setInitialUrl,
  setDialogMode
) => {
  const allCommands = getBaseCommands(
    editor,
    onOpenChange,
    setInitialText,
    setInitialUrl,
    setDialogMode
  );

  const group = allCommands.find((g) => g.group.toLowerCase() === category.toLowerCase());
  return group ? group.items : [];
};

/**
 * Search commands by query
 * @param {string} query - Search query
 * @param {Object} editor - TipTap editor instance
 * @param {Function} onOpenChange - Dialog state change handler
 * @param {Function} setInitialText - Set initial text for link dialog
 * @param {Function} setInitialUrl - Set initial URL for link dialog
 * @param {Function} setDialogMode - Set dialog mode
 * @returns {Array} Array of matching commands
 */
export const searchCommands = (
  query,
  editor,
  onOpenChange,
  setInitialText,
  setInitialUrl,
  setDialogMode
) => {
  const allCommands = getBaseCommands(
    editor,
    onOpenChange,
    setInitialText,
    setInitialUrl,
    setDialogMode
  );

  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return allCommands;

  return allCommands
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const searchableText = [item.title, item.subtitle, item.shortcut, ...(item.keywords || [])]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchTerm);
      }),
    }))
    .filter((group) => group.items.length > 0);
};

export default {
  getBaseCommands,
  getCommandsByCategory,
  searchCommands,
};
