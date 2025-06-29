import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import {
  Bold,
  Code,
  Highlighter,
  Italic,
  Link,
  PaintBucket,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useState } from "react";
import ColorPickerPanel from "./ColorPickerPanel";
import LinkEditDialog from "./LinkEditDialog";
import LinkCreateDialog from "./LinkCreateDialog";
import { useLinkEditor } from "../hooks/useLinkEditor";

export default function BubbleMenu({ editor }) {
  const [showColorPanel, setShowColorPanel] = useState(false);
  const linkEditor = useLinkEditor(editor);

  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        placement: "top",
        onHide: () => setShowColorPanel(false), // Close color panel when menu hides
      }}
      className="w-[360px] z-50 flex items-center gap-2 px-2 py-2 bg-white border border-gray-200 shadow-xl rounded-xl dark:border-zinc-700 dark:bg-zinc-900"
    >
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
		hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
		focus:outline-none focus:ring-2 focus:ring-blue-200
		active:bg-blue-50  ${editor.isActive("bold") ? "bg-blue-100 text-blue-600" : ""}`}
      >
        <Bold className="w-5 h-5" />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
		hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
		focus:outline-none focus:ring-2 focus:ring-blue-200
		active:bg-blue-50  ${editor.isActive("italic") ? "bg-blue-100 text-blue-600" : ""}`}
      >
        <Italic className="w-5 h-5" />
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
		hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
		focus:outline-none focus:ring-2 focus:ring-blue-200
		active:bg-blue-50  ${editor.isActive("underline") ? "bg-blue-100 text-blue-600" : ""}`}
      >
        <Underline className="w-5 h-5" />
      </button>

      {/* Strikethrough */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
		hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
		focus:outline-none focus:ring-2 focus:ring-blue-200
		active:bg-blue-50  ${editor.isActive("strike") ? "bg-blue-100 text-blue-600" : ""}`}
      >
        <Strikethrough className="w-5 h-5" />
      </button>

      {/* Inline Code */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
		hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
		focus:outline-none focus:ring-2 focus:ring-blue-200
		active:bg-blue-50  ${editor.isActive("code") ? "bg-blue-100 text-blue-600" : ""}`}
      >
        <Code className="w-5 h-5" />
      </button>

      {/* Highlight */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
		hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
		focus:outline-none focus:ring-2 focus:ring-blue-200
		active:bg-blue-50  ${editor.isActive("highlight") ? "bg-yellow-100 text-yellow-600" : ""}`}
      >
        <Highlighter className="w-5 h-5" />
      </button>

      {/* Link */}
      <button
        type="button"
        onClick={() => {
          if (editor.isActive("link")) {
            // If text is already a link, open edit dialog
            linkEditor.openLinkEditDialog();
          } else {
            // If no link, open create dialog
            linkEditor.openLinkCreateDialog();
          }
        }}
        className={`p-2 rounded-lg transition text-gray-600 dark:text-gray-300
			hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800
			focus:outline-none focus:ring-2 focus:ring-blue-200
			active:bg-blue-50  ${editor.isActive("link") ? "bg-blue-100 text-blue-600" : ""}`}
      >
        <Link className="w-5 h-5" />
      </button>

      {/* 🎨 Color Picker at End */}
      <button
        type="button"
        onClick={() => setShowColorPanel((prev) => !prev)}
        className={`p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
		hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
		focus:outline-none focus:ring-2 focus:ring-blue-200
		active:bg-blue-50  ${showColorPanel ? "bg-pink-100 text-pink-600" : ""}`}
      >
        <PaintBucket className="w-5 h-5" />
      </button>

      {/* Color Picker Panel */}
      {showColorPanel && (
        <div className="absolute left-0 z-50 top-12">
          <ColorPickerPanel editor={editor} onClose={() => setShowColorPanel(false)} />
        </div>
      )}

      {/* Link Dialogs */}
      <LinkEditDialog {...linkEditor.editDialogProps} />
      <LinkCreateDialog {...linkEditor.createDialogProps} />
    </TiptapBubbleMenu>
  );
}
