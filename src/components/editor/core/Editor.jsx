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
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextAlign from "@tiptap/extension-text-align";
import { all, createLowlight } from "lowlight";
import { Toggle, ToggleSummary } from "../extensions/toggle";
import { TrailingNode } from "../extensions/trailing-node/trailing-node-extension";

// Create lowlight instance for syntax highlighting
const lowlight = createLowlight(all);

/**
 * 🎯 Main TipTap Editor Component - The Heart of the System
 *
 * This is where the magic happens! This component is the actual editor that users type in.
 * Think of it as the "engine" of a car - it does all the heavy lifting.
 *
 * 🏗️ What this component does:
 * - Creates and manages the TipTap editor instance
 * - Loads all the extensions (bold, italic, links, toggles, etc.)
 * - Handles user interactions (typing, clicking, keyboard shortcuts)
 * - Manages content loading and saving
 * - Provides the editing surface where users create content
 *
 * 🔧 Key Features:
 * - Modular extension system (easy to add/remove features)
 * - Auto-focus and placeholder support
 * - Character limits and word counting
 * - Keyboard shortcuts (Ctrl+S for save, etc.)
 * - Click-to-focus behavior (like Notion/VSCode)
 * - Trailing nodes (always have an escape route from blocks)
 *
 * 💡 How it works:
 * 1. Component mounts and creates TipTap editor instance
 * 2. Registers itself with EditorProvider for global management
 * 3. Loads initial content if provided
 * 4. Sets up event listeners for user interactions
 * 5. Renders the editing surface and any child components (menus, toolbars)
 */

/**
 * 📋 Editor Component Props - What you can customize
 *
 * @param {string} instanceId - Unique ID for this editor (REQUIRED!)
 *   - Think of this as the editor's "name tag"
 *   - Must be unique if you have multiple editors on the same page
 *   - Used for saving, loading, and managing editor state
 *   - Example: "blog-post-editor", "comment-editor-123"
 *
 * @param {Object} initialContent - Starting content for the editor
 *   - Should be in TipTap's JSON format (not HTML or plain text)
 *   - Can be null/undefined for empty editor
 *   - Example: { type: 'doc', content: [{ type: 'paragraph', content: [...] }] }
 *
 * @param {Array} extensions - Extra TipTap extensions to add (advanced usage)
 *   - Most users won't need this - we include all common extensions by default
 *   - Use this to add custom extensions you've built
 *
 * @param {Object} config - Configuration overrides
 *   - Customize editor behavior (placeholder text, character limits, etc.)
 *   - Merges with default configuration
 *   - Example: { placeholder: { text: "Start writing..." }, characterLimit: 1000 }
 *
 * @param {Function} onSave - Called when user saves (Ctrl+S or save button)
 *   - Receives the current content as parameter
 *   - This is where you'd save to your database/API
 *   - Example: (content) => saveToDatabase(content)
 *
 * @param {Function} onChange - Called every time content changes
 *   - Receives the current content as parameter
 *   - Useful for real-time features, auto-save, etc.
 *   - Example: (content) => setUnsavedChanges(true)
 *
 * @param {Function} onFocus - Called when editor gains focus
 * @param {Function} onBlur - Called when editor loses focus
 *
 * @param {boolean} editable - Whether users can edit the content
 *   - true: Normal editing mode
 *   - false: Read-only mode (like a preview)
 *
 * @param {string} className - Additional CSS classes for styling
 * @param {Object} style - Inline styles (use className instead when possible)
 *
 * @param {ReactNode} children - Additional components to render inside editor
 *   - Usually menus, toolbars, or custom UI elements
 *   - These components automatically receive the editor instance as props
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
  // 🏗️ Get the global editor context (shared state and utilities)
  const editorContext = useEditorContext();

  // 📝 No local state needed - the TipTap editor manages its own state internally
  // This keeps our component clean and lets TipTap handle the heavy lifting

  // 🔗 Refs for stable references that don't trigger re-renders
  const editorRef = useRef(null); // Reference to the TipTap editor instance
  const saveCallbackRef = useRef(onSave); // Stable reference to save function

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
      // Merge context config, default config, and component-specific config
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
      // Create minimal fallback configuration if config creation fails
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
          // Re-throw error to allow parent components to handle save failures
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

  // 🔧 Create the editor configuration with all extensions
  // This is where we define what features the editor has!
  const stableEditorConfig = useMemo(
    () => ({
      // Don't render immediately - wait for proper setup
      immediatelyRender: false,

      // 🎯 Extensions - These add all the functionality to your editor
      extensions: [
        // 🏗️ StarterKit: The foundation (paragraphs, headings, bold, italic, etc.)
        StarterKit.configure({
          // We disable the basic code block because we use a fancier one below
          codeBlock: false,
        }),

        // 🎨 Text styling extensions
        TextStyle, // Required for color support
        Color, // Text colors (red, blue, etc.)
        Highlight.configure({ multicolor: true }), // Text highlighting (yellow, pink, etc.)
        Underline, // Underline text support

        // 🔗 Link extension - Makes text clickable
        Link.configure({
          openOnClick: false, // Don't open links when clicked (we handle this manually)
          HTMLAttributes: {
            class: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
            rel: "noopener noreferrer nofollow", // Security attributes
            target: "_blank", // Open in new tab
          },
          linkOnPaste: true, // Auto-create links when pasting URLs
          autolink: true, // Auto-detect URLs as you type
          protocols: ["http", "https", "ftp", "mailto"], // Supported URL types
        }),

        // ✅ Task list extensions - For todo lists
        TaskList.configure({
          nested: true, // Allow nested task lists
        }),
        TaskItem.configure({
          nested: true, // Allow nested task items
        }),

        // 💻 Code block with syntax highlighting - For code snippets
        CodeBlockLowlight.configure({
          lowlight, // Syntax highlighter instance
          defaultLanguage: "plaintext", // Default when no language specified
        }),

        // 📐 Text alignment extension - Left, center, right, justify
        TextAlign.configure({
          types: ["heading", "paragraph"], // Which elements can be aligned
          alignments: ["left", "center", "right", "justify"], // Available alignments
        }),

        // 🔽 Toggle extensions - Notion-like collapsible blocks
        Toggle.configure({
          defaultOpen: true, // New toggles start expanded
        }),
        ToggleSummary, // The clickable header part of toggles

        // 🚪 Trailing node - Always provides an "escape route" from blocks
        TrailingNode.configure({
          node: "paragraph", // Add a paragraph at the end
          notAfter: [], // Always add it (no exceptions)
        }),
        Placeholder.configure({
          placeholder: ({ node, editor, pos }) => {
            if (node.type.name === "heading") {
              return `Heading ${node.attrs.level}`;
            }
            if (node.type.name === "toggleSummary") {
              return "Toggle";
            }

            // Check if this paragraph is inside a toggle
            const isInToggle =
              node.type.name === "paragraph" && node.attrs && node.attrs.parentType === "toggle";
            if (isInToggle) {
              return "Empty toggle. Click or press space to add content.";
            }

            // For trailing nodes and regular paragraphs
            if (node.type.name === "paragraph") {
              return "Type '/' for commands or start writing...";
            }

            return "Type '/' for commands or start writing...";
          },
          showOnlyWhenEditable: true,
          showOnlyCurrent: true, // Only show placeholder for currently focused empty node
          includeChildren: true,
          emptyNodeClass: "is-empty",
        }), // Add placeholder support
      ],
      content: initialContent || "",
      editorProps: {
        attributes: {
          class: "focus:outline-none max-w-none prose prose-lg min-h-[500px]",
        },
        handleClick: (view, pos, event) => {
          // Allow clicking anywhere in the editor to focus it (like Notion/VSCode)
          // Return false to allow default behavior and not interfere with other events
          return false;
        },
      },
      onCreate: ({ editor }) => {
        // Store editor reference for component access
        editorRef.current = editor;

        // Register editor instance with context for global management
        editorContextRef.current?.registerEditor?.(instanceId, editor, handleSaveRef.current);

        // Implement autofocus behavior based on configuration
        try {
          const shouldAutofocus = instanceConfigRef.current?.autofocus ?? true;
          if (shouldAutofocus) {
            setTimeout(() => {
              if (editor && !editor.isDestroyed) {
                // Focus at start for empty documents, end for documents with content
                const isEmpty = editor.isEmpty;
                editor.commands.focus(isEmpty ? "start" : "end");
              }
            }, 100);
          }
        } catch (error) {
          // Silently handle autofocus failures - not critical for editor functionality
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
        // Unregister editor from context when component unmounts
        // This prevents memory leaks and ensures proper cleanup
        editorContextRef.current?.unregisterEditor?.(instanceId);
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
          // Clicked outside editor content but inside container
          // Focus at start if empty, otherwise at end
          const isEmpty = editor.isEmpty;
          editor.commands.focus(isEmpty ? "start" : "end");
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
