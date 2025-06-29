/**
 * Editor Hooks
 * Centralized exports for all editor-related hooks
 *
 * @fileoverview This module provides a centralized export point for all
 * editor-related React hooks, including editor management, content handling,
 * and UI interaction hooks.
 */

import { useEditorContext, useEditorInstance } from "../core/EditorProvider";
import { useSlashCommand } from "../ui/menus/SlashMenu";
import { useEditorContent } from "./useEditorContent";
import { useTiptapEditor } from "./useTiptapEditor";
import { useLinkEditor } from "./useLinkEditor";

// Core editor hooks
export { useEditorContext, useEditorInstance } from "../core/EditorProvider";

// UI hooks
export { useSlashCommand } from "../ui/menus/SlashMenu/hooks/useSlashCommand";

// Re-export the original hook for backward compatibility
export { useTiptapEditor } from "./useTiptapEditor";

// Content management hooks
export { useEditorContent } from "./useEditorContent";

// Link editing hooks
export { useLinkEditor } from "./useLinkEditor";

// Default export with all hooks
export default {
  useEditorContext,
  useEditorInstance,
  useSlashCommand,
  useTiptapEditor,
  useEditorContent,
  useLinkEditor,
};
