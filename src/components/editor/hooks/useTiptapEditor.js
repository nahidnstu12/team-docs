"use client";

import * as React from "react";
import { useCurrentEditor } from "@tiptap/react";

/**
 * useTiptapEditor Hook
 * Enhanced version of the original hook with additional functionality
 * 
 * @fileoverview This hook provides access to the TipTap editor instance
 * with additional utilities and backward compatibility.
 */

/**
 * Enhanced TipTap editor hook
 * @param {Object} providedEditor - Optional editor instance to use instead of context
 * @returns {Object} Editor instance and utilities
 */
export function useTiptapEditor(providedEditor) {
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
