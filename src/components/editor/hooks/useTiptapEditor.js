"use client";

import * as React from "react";
import { useCurrentEditor } from "@tiptap/react";

/**
 * 🪝 useTiptapEditor Hook - Your Gateway to Editor Power
 *
 * This hook gives you access to the TipTap editor instance and lots of useful utilities.
 * Think of it as your "remote control" for the editor.
 *
 * 🎯 What this hook provides:
 * - Direct access to the TipTap editor instance
 * - Utility functions (getHTML, getJSON, focus, etc.)
 * - State information (isEmpty, canUndo, wordCount, etc.)
 * - Content manipulation methods (setContent, clearContent, etc.)
 *
 * 💡 When to use this hook:
 * - Inside components that need to interact with the editor
 * - When building custom menus or toolbars
 * - When you need to programmatically control the editor
 * - For getting editor state information
 *
 * 📝 Example usage:
 * ```jsx
 * function MyCustomToolbar() {
 *   const { editor, canUndo, canRedo, getHTML } = useTiptapEditor();
 *
 *   return (
 *     <div>
 *       <button onClick={() => editor.chain().focus().undo().run()} disabled={!canUndo}>
 *         Undo
 *       </button>
 *       <button onClick={() => console.log(getHTML())}>
 *         Get Content
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * 🎯 The Main Hook Function
 *
 * @param {Object} providedEditor - Optional: Use a specific editor instance
 *   - Usually you don't need this - the hook finds the editor automatically
 *   - Useful when you have multiple editors and need to target a specific one
 *
 * @returns {Object} Everything you need to control the editor
 */
export function useTiptapEditor(providedEditor) {
  // 🔍 Get the editor instance (either provided or from context)
  const { editor: coreEditor } = useCurrentEditor();
  const editor = React.useMemo(() => providedEditor || coreEditor, [providedEditor, coreEditor]);

  // Additional utilities
  const utilities = React.useMemo(() => {
    if (!editor) {
      return {
        isReady: false,
        isEmpty: true,
        wordCount: 0,
        characterCount: 0,
        canUndo: false,
        canRedo: false,
      };
    }

    return {
      isReady: true,
      isEmpty: editor.isEmpty,
      wordCount: editor.storage?.characterCount?.words?.() || 0,
      characterCount: editor.storage?.characterCount?.characters?.() || 0,
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),

      // Content utilities
      getHTML: () => editor.getHTML(),
      getJSON: () => editor.getJSON(),
      getText: () => editor.getText(),

      // Selection utilities
      getSelection: () => editor.state.selection,
      hasSelection: () => !editor.state.selection.empty,
      getSelectedText: () => {
        const { from, to } = editor.state.selection;
        return editor.state.doc.textBetween(from, to);
      },

      // Focus utilities
      focus: (position = "end") => editor.commands.focus(position),
      blur: () => editor.commands.blur(),
      isFocused: editor.isFocused,

      // Content manipulation
      setContent: (content) => editor.commands.setContent(content),
      clearContent: () => editor.commands.clearContent(),
      insertContent: (content) => editor.commands.insertContent(content),

      // History
      undo: () => editor.commands.undo(),
      redo: () => editor.commands.redo(),

      // Formatting checks
      isActive: (name, attributes) => editor.isActive(name, attributes),
      can: () => editor.can(),

      // Event handlers
      on: (event, callback) => editor.on(event, callback),
      off: (event, callback) => editor.off(event, callback),

      // Destroy
      destroy: () => editor.destroy(),
    };
  }, [editor]);

  return {
    editor,
    ...utilities,
  };
}

export default useTiptapEditor;
