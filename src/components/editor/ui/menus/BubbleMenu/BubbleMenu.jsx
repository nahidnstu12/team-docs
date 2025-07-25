"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  Link,
  Palette,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";
import ColorPickerPanel from "../../ColorPickerPanel";
import { BUBBLE_MENU_CONFIG } from "../../../core/EditorConfig";

/**
 * Bubble Menu Component
 * Context-sensitive formatting toolbar that appears when text is selected
 *
 * @fileoverview This component provides a floating toolbar with formatting
 * options that appears when text is selected in the editor.
 */

/**
 * BubbleMenu Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.editor - TipTap editor instance
 * @param {string} props.instanceId - Editor instance identifier
 * @param {Object} props.config - Bubble menu configuration overrides
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onLinkClick - Callback for link button click
 */
const BubbleMenuComponent = ({ editor, instanceId, config = {}, className = "", onLinkClick }) => {
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Memoize configuration to prevent recreation
  const menuConfig = useMemo(() => ({ ...BUBBLE_MENU_CONFIG, ...config }), [config]);

  // Handle ESC key press to close panels - memoized to prevent infinite loops
  useEffect(() => {
    if (!editor?.view?.dom) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowColorPanel(false);
        setShowMoreOptions(false);
      }
    };

    // Listen on editor view DOM
    const editorDom = editor.view.dom;
    editorDom.addEventListener("keydown", handleKeyDown);

    return () => {
      if (editorDom) {
        editorDom.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [editor?.view?.dom]); // Only depend on the DOM element, not the entire editor object

  // Don't render if editor is not available
  if (!editor) return null;

  /**
   * Handle link button click - memoized to prevent recreation
   */
  const handleLinkClick = useCallback(() => {
    if (onLinkClick) {
      onLinkClick(editor, instanceId);
    } else {
      // Default link behavior - could open a link dialog
      const url = window.prompt("Enter URL:");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  }, [onLinkClick, editor, instanceId]);

  /**
   * Toggle color panel - memoized to prevent recreation
   */
  const toggleColorPanel = useCallback(
    (event) => {
      // Prevent event from bubbling up and closing the bubble menu
      event.preventDefault();
      event.stopPropagation();
      setShowColorPanel(!showColorPanel);
      setShowMoreOptions(false);
    },
    [showColorPanel]
  );

  /**
   * Toggle more options panel - memoized to prevent recreation
   */
  const toggleMoreOptions = useCallback(() => {
    setShowMoreOptions(!showMoreOptions);
    setShowColorPanel(false);
  }, [showMoreOptions]);

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{
        ...menuConfig.tippyOptions,
        // Prevent hiding when interacting with color panel or other interactive elements
        interactive: true,
        interactiveBorder: 10,
        hideOnClick: false,
        onHide: () => {
          setShowColorPanel(false);
          setShowMoreOptions(false);
        },
      }}
      className={`
        bubble-menu
        w-auto max-w-[480px] z-50 flex items-center gap-1 px-3 py-2
        bg-white border border-gray-200 shadow-xl rounded-xl
        dark:border-zinc-700 dark:bg-zinc-900
        ${className}
      `}
      shouldShow={menuConfig.shouldShow}
    >
      {/* Primary formatting buttons */}
      <div className="flex items-center gap-1">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
            hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
            focus:outline-none focus:ring-2 focus:ring-blue-200
            active:bg-blue-50
            ${editor.isActive("bold") ? "bg-blue-100 text-blue-600" : ""}
          `}
          title="Bold (⌘B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
            hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
            focus:outline-none focus:ring-2 focus:ring-blue-200
            active:bg-blue-50
            ${editor.isActive("italic") ? "bg-blue-100 text-blue-600" : ""}
          `}
          title="Italic (⌘I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
            hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
            focus:outline-none focus:ring-2 focus:ring-blue-200
            active:bg-blue-50
            ${editor.isActive("underline") ? "bg-blue-100 text-blue-600" : ""}
          `}
          title="Underline (⌘U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
            hover:bg-blue-100 hover:text-black dark:hover:bg-zinc-800 
            focus:outline-none focus:ring-2 focus:ring-blue-200
            active:bg-blue-50
            ${editor.isActive("strike") ? "bg-blue-100 text-blue-600" : ""}
          `}
          title="Strikethrough (⌘⇧X)"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

      {/* Secondary formatting buttons */}
      <div className="flex items-center gap-1">
        {/* Highlight */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
            hover:bg-yellow-100 hover:text-black dark:hover:bg-zinc-800 
            focus:outline-none focus:ring-2 focus:ring-yellow-200
            active:bg-yellow-50
            ${editor.isActive("highlight") ? "bg-yellow-100 text-yellow-600" : ""}
          `}
          title="Highlight (⌘⇧H)"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        {/* Color picker toggle */}
        <button
          type="button"
          onClick={toggleColorPanel}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300 
            hover:bg-purple-100 hover:text-black dark:hover:bg-zinc-800 
            focus:outline-none focus:ring-2 focus:ring-purple-200
            active:bg-purple-50
            ${showColorPanel ? "bg-purple-100 text-purple-600" : ""}
          `}
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={handleLinkClick}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300
            hover:bg-green-100 hover:text-black dark:hover:bg-zinc-800
            focus:outline-none focus:ring-2 focus:ring-green-200
            active:bg-green-50
            ${editor.isActive("link") ? "bg-green-100 text-green-600" : ""}
          `}
          title="Add Link"
        >
          <Link className="w-4 h-4" />
        </button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

      {/* More options */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleMoreOptions}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300
            hover:bg-gray-100 hover:text-black dark:hover:bg-zinc-800
            focus:outline-none focus:ring-2 focus:ring-gray-200
            active:bg-gray-50
            ${showMoreOptions ? "bg-gray-100 text-gray-600" : ""}
          `}
          title="More Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-1" />

        {/* Unstyle - Remove all formatting */}
        <button
          type="button"
          onClick={() => {
            editor
              .chain()
              .focus()
              .unsetBold()
              .unsetItalic()
              .unsetUnderline()
              .unsetStrike()
              .unsetHighlight()
              .unsetSubscript()
              .unsetSuperscript()
              .unsetLink()
              .unsetColor()
              .run();
          }}
          className={`
            p-2 rounded-lg transition text-gray-600 dark:text-gray-300
            hover:bg-red-100 hover:text-black dark:hover:bg-zinc-800
            focus:outline-none focus:ring-2 focus:ring-red-200
            active:bg-red-50
          `}
          title="Remove all formatting"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Color picker panel */}
      {showColorPanel && (
        <div className="absolute top-full left-0 mt-2 z-10">
          <ColorPickerPanel editor={editor} onClose={() => setShowColorPanel(false)} />
        </div>
      )}

      {/* More options panel */}
      {showMoreOptions && (
        <div className="absolute top-full right-0 mt-2 z-10 bg-white border border-gray-200 shadow-xl rounded-lg p-2 min-w-[160px] dark:bg-zinc-900 dark:border-zinc-700">
          <div className="flex flex-col gap-1">
            {/* Subscript */}
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleSubscript().run();
                setShowMoreOptions(false);
              }}
              className={`
                flex items-center gap-2 px-3 py-2 text-sm rounded-md transition
                hover:bg-gray-100 dark:hover:bg-zinc-800
                ${
                  editor.isActive("subscript")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 dark:text-gray-300"
                }
              `}
            >
              <Subscript className="w-4 h-4" />
              Subscript
            </button>

            {/* Superscript */}
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleSuperscript().run();
                setShowMoreOptions(false);
              }}
              className={`
                flex items-center gap-2 px-3 py-2 text-sm rounded-md transition
                hover:bg-gray-100 dark:hover:bg-zinc-800
                ${
                  editor.isActive("superscript")
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 dark:text-gray-300"
                }
              `}
            >
              <Superscript className="w-4 h-4" />
              Superscript
            </button>
          </div>
        </div>
      )}
    </TiptapBubbleMenu>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const BubbleMenu = React.memo(BubbleMenuComponent);

export default BubbleMenu;
