"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useEditorContext } from "./EditorProvider";
import { DEFAULT_EDITOR_CONFIG, getInstanceConfig } from "./EditorConfig";

import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extension-placeholder";

/**
 * Main TipTap Editor Component
 * Centralized editor with modular extension system
 *
 * @fileoverview This is the core editor component that integrates with the
 * EditorProvider and manages TipTap editor instances with a modular extension system.
 */

/**
 * Editor Component
 *
 * @param {Object} props - Component props
 * @param {string} props.instanceId - Unique identifier for this editor instance
 * @param {Object} props.initialContent - Initial content for the editor
 * @param {Array} props.extensions - Additional extensions to load
 * @param {Object} props.config - Editor configuration overrides
 * @param {Function} props.onSave - Save callback function
 * @param {Function} props.onChange - Change callback function
 * @param {Function} props.onFocus - Focus callback function
 * @param {Function} props.onBlur - Blur callback function
 * @param {boolean} props.editable - Whether the editor is editable
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {React.ReactNode} props.children - Child components (menus, toolbars, etc.)
 */
const EditorComponent = ({
  instanceId,
  initialContent = null,
  extensions = [], // eslint-disable-line no-unused-vars
  config = {},
  onSave,
  onChange,
  onFocus,
  onBlur,
  editable = true,
  className = "",
  style = {},
  children,
  ...props
}) => {
  // Get editor context
  const editorContext = useEditorContext();

  // No local state needed - editor handles its own initialization

  // Refs
  const editorRef = useRef(null);
  const saveCallbackRef = useRef(onSave);

  // Store callback refs to avoid dependencies in useEditor
  const onChangeRef = useRef(onChange);
  const onFocusRef = useRef(onFocus);
  const onBlurRef = useRef(onBlur);
  const editorContextRef = useRef(editorContext);
  const handleSaveRef = useRef(null); // Initialize with null, will be set later
  const instanceConfigRef = useRef(null); // Initialize with null, will be set later

  // Update callback refs when props change
  useEffect(() => {
    saveCallbackRef.current = onSave;
    onChangeRef.current = onChange;
    onFocusRef.current = onFocus;
    onBlurRef.current = onBlur;
    editorContextRef.current = editorContext;
    // handleSave and instanceConfig are updated in their own useEffects
  }, [onSave, onChange, onFocus, onBlur, editorContext]);

  // Note: Extensions are now handled with StarterKit by default to prevent infinite loops
  // The complex extension loading system was causing re-rendering issues

  // Memoize instance configuration to prevent recreation on every render
  const instanceConfig = useMemo(() => {
    try {
      console.log("Creating instanceConfig...");

      return getInstanceConfig(instanceId, {
        ...(editorContext?.config || DEFAULT_EDITOR_CONFIG || {}),
        ...config,
        editorProps: {
          ...(editorContext?.config?.editorProps || DEFAULT_EDITOR_CONFIG?.editorProps || {}),
          ...(config?.editorProps || {}),
          editable: () => editable,
        },
      });
    } catch (error) {
      console.error("❌ Error creating instanceConfig:", error);

      // Create a minimal fallback config
      return {
        autofocus: true,
        editorProps: {
          attributes: {
            class: "focus:outline-none max-w-none prose prose-lg",
          },
          editable: () => editable,
        },
      };
    }
  }, [instanceId, editorContext?.config, config, editable]);

  // Update instanceConfigRef after instanceConfig is defined
  useEffect(() => {
    instanceConfigRef.current = instanceConfig;
  }, [instanceConfig]);

  // Debug logging for configuration issues
  if (process.env.NODE_ENV === "development") {
    console.log("=== EDITOR DEBUG ===");
    console.log("instanceId:", instanceId);
    console.log("instanceConfig:", instanceConfig ? "present" : "null");
    console.log("editorContext:", editorContext ? "present" : "null");
    console.log("=== END DEBUG ===");
  }

  /**
   * Save handler for this editor instance
   * @param {Object} content - Editor content to save
   * @returns {Promise<void>}
   */
  const handleSave = useCallback(
    async (content) => {
      if (saveCallbackRef.current) {
        try {
          await saveCallbackRef.current(content, instanceId);
        } catch (error) {
          console.error(`Save failed for editor ${instanceId}:`, error);
          throw error;
        }
      }
    },
    [instanceId]
  );

  // Update handleSaveRef after handleSave is defined
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  // Remove all the complex editorConfig logic and use the stable approach below

  // Don't use fallback config - always wait for proper extensions
  // TipTap requires proper extensions to function, empty extensions cause schema errors

  // Create a stable base configuration that doesn't change
  const stableEditorConfig = useMemo(
    () => ({
      immediatelyRender: false,
      extensions: [
        StarterKit, // Always use StarterKit for stability
        TextStyle, // Required for Color extension
        Color, // Add color support for ColorPickerPanel
        Highlight.configure({ multicolor: true }), // Add highlight support for BubbleMenu
        Underline, // Add underline support for BubbleMenu
        Link.configure({
          openOnClick: false, // We'll handle clicks manually for editing
          HTMLAttributes: {
            class: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
          },
        }), // Add link support for BubbleMenu
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === "heading") {
              return `Heading ${node.attrs.level}`;
            }
            return "Type '/' for commands or start writing...";
          },
          showOnlyWhenEditable: true,
          showOnlyCurrent: false,
        }), // Add placeholder support
      ],
      content: initialContent || "",
      editorProps: {
        attributes: {
          class: "focus:outline-none max-w-none prose prose-lg min-h-[500px]",
        },
        handleClick: (view, pos, event) => {
          // Allow clicking anywhere in the editor to focus it (like Notion/VSCode)
          try {
            const { state, dispatch } = view;
            const { doc, schema } = state;

            // If clicking beyond content, move cursor to end of document
            if (pos >= doc.content.size) {
              const endPos = doc.content.size;
              const $pos = doc.resolve(endPos);
              const tr = state.tr.setSelection(schema.selection.near($pos, -1));
              dispatch(tr);
              return true;
            }

            // Default behavior for clicking on content
            return false;
          } catch (error) {
            console.warn("Click handler error:", error);
            // Fallback: just focus the editor
            view.focus();
            return true;
          }
        },
      },
      onCreate: ({ editor }) => {
        console.log("Editor created successfully");
        editorRef.current = editor;

        // Register editor with context using ref
        editorContextRef.current?.registerEditor?.(instanceId, editor, handleSaveRef.current);

        // Safe autofocus implementation using ref
        try {
          const shouldAutofocus = instanceConfigRef.current?.autofocus ?? true;
          if (shouldAutofocus) {
            setTimeout(() => {
              if (editor && !editor.isDestroyed) {
                editor.commands.focus("end");
              }
            }, 100);
          }
        } catch (error) {
          console.warn("Autofocus failed:", error);
        }
      },
      onUpdate: ({ editor }) => {
        if (onChangeRef.current) {
          onChangeRef.current(editor.getJSON(), instanceId);
        }
      },
      onFocus: ({ editor, event }) => {
        if (onFocusRef.current) {
          onFocusRef.current(editor, event, instanceId);
        }
      },
      onBlur: ({ editor, event }) => {
        if (onBlurRef.current) {
          onBlurRef.current(editor, event, instanceId);
        }
      },
      onDestroy: () => {
        console.log(`🔥 Editor onDestroy called for instanceId: ${instanceId}`);
        editorContextRef.current?.unregisterEditor?.(instanceId);
        console.log(`✅ Editor cleanup completed for instanceId: ${instanceId}`);
      },
    }),
    [instanceId, initialContent]
  ); // Only depend on truly stable values

  const editor = useEditor(stableEditorConfig);

  // Handle clicking in editor container to focus (must be before early returns)
  const handleContainerClick = useCallback(
    (e) => {
      if (editor && !editor.isDestroyed) {
        const editorElement = e.currentTarget.querySelector(".ProseMirror");
        if (editorElement && !editorElement.contains(e.target)) {
          // Clicked outside editor content but inside container - focus at end
          editor.commands.focus("end");
        }
      }
    },
    [editor]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Handle case where editor is not initialized
  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50/50 rounded-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <span className="mt-2 text-sm text-gray-600 block">Creating editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`editor-container ${className} min-h-[500px] cursor-text`}
      style={style}
      data-editor-id={instanceId}
      onClick={handleContainerClick}
      {...props}
    >
      {/* Render child components (menus, toolbars, etc.) */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { editor, instanceId });
        }
        return child;
      })}

      {/* Main editor content */}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const Editor = React.memo(EditorComponent);

/**
 * Default export
 */
export default Editor;
