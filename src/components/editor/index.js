/**
 * 🎯 TipTap Editor System - Main Entry Point
 *
 * This is your one-stop shop for all TipTap editor functionality!
 * Think of this as the "front desk" of a hotel - everything you need starts here.
 *
 * 📋 What this file does:
 * - Exports all editor components, hooks, and services in one place
 * - Provides pre-built editor configurations (Complete, Minimal, Custom)
 * - Acts as the main import point for your application
 *
 * 🏗️ Architecture Overview:
 * - Core: The main editor engine and provider system
 * - Extensions: Add-on features like toggles, links, colors, etc.
 * - UI: Visual components like menus, toolbars, dialogs
 * - Hooks: React hooks for editor functionality
 * - Services: Business logic for saving, loading, etc.
 *
 * 💡 How to use:
 * ```jsx
 * import { CompleteEditor } from "@/components/editor";
 *
 * <CompleteEditor
 *   instanceId="my-editor"
 *   onSave={handleSave}
 *   initialContent={content}
 * />
 * ```
 */

// 📦 Import all the building blocks
import Editor from "./core/Editor";
import { EditorProvider } from "./core/EditorProvider";
import EditorService from "./services/EditorService";
import BubbleMenu from "./ui/BubbleMenu";
import SlashMenu from "./ui/menus/SlashMenu";

// 🏗️ CORE COMPONENTS - The foundation of your editor
// These are the essential pieces that make the editor work
export { Editor } from "./core/Editor"; // Main editor component
export { EditorProvider, useEditorContext, useEditorInstance } from "./core/EditorProvider"; // Context system
export * from "./core/EditorConfig"; // Configuration constants

// 🔧 EXTENSION SYSTEM - Add-on features for your editor
// Extensions add functionality like links, colors, toggles, etc.
export {
  ExtensionRegistry, // Registry to manage all extensions
  registerExtension, // Add new extensions
  loadExtension, // Load specific extensions
  getBaseExtensions, // Get default extensions
} from "./extensions";
export * from "./extensions/custom"; // Custom extensions we built

// 🎨 UI COMPONENTS - Visual elements users interact with
// These are the menus, buttons, and dialogs that make the editor user-friendly
export { default as BubbleMenu } from "./ui/BubbleMenu"; // Floating menu when text is selected
export { SlashMenu } from "./ui/menus/SlashMenu"; // Command menu (type "/" to open)
export { default as ColorPickerPanel } from "./ui/ColorPickerPanel"; // Color selection panel
export { default as LinkEditDialog } from "./ui/LinkEditDialog"; // Dialog to edit existing links
export { default as LinkCreateDialog } from "./ui/LinkCreateDialog"; // Dialog to create new links
export { default as Toolbar } from "./ui/Toolbar"; // Top toolbar with formatting buttons

// 🪝 HOOKS - React hooks for editor functionality
// These provide easy access to editor features in your components
export * from "./hooks";

// 🛠️ SERVICES - Business logic and data operations
// Services handle saving, loading, and other backend operations
export { EditorService } from "./services/EditorService";

// ⚡ COMMANDS - Editor commands and actions
// These are the actual functions that perform editor operations
export * from "./ui/commands";

// 🔧 UTILITIES - Helper functions (currently empty but ready for future use)
// export * from "./utils";

/**
 * 🚀 CompleteEditor - The Full-Featured Editor
 *
 * This is your go-to editor with ALL features enabled out of the box!
 * Perfect for rich content creation like documentation, blog posts, etc.
 *
 * 🎯 What you get:
 * - BubbleMenu: Appears when you select text (bold, italic, colors, etc.)
 * - SlashMenu: Type "/" to insert blocks (headings, lists, toggles, etc.)
 * - All extensions: Links, colors, toggles, code blocks, task lists, etc.
 * - Auto-save disabled by default (you control when to save)
 *
 * 📝 Example usage:
 * ```jsx
 * <CompleteEditor
 *   instanceId="my-doc-editor"
 *   initialContent={existingContent}
 *   onSave={(content) => saveToDatabase(content)}
 *   onChange={(content) => console.log('Content changed:', content)}
 * />
 * ```
 *
 * @param {string} instanceId - Unique ID for this editor (important for multiple editors)
 * @param {string} pageId - Page ID for saving (optional, used by EditorService)
 * @param {Object} initialContent - Starting content (JSON format from TipTap)
 * @param {Function} onSave - Called when user manually saves (Ctrl+S or save button)
 * @param {Function} onChange - Called every time content changes
 * @param {Object} config - Custom configuration to override defaults
 * @param {string} className - Additional CSS classes
 * @param {boolean} editable - Whether the editor is editable or read-only
 * @param {boolean} showBubbleMenu - Whether to show the bubble menu when text is selected
 * @param {ReactNode} children - Additional components to render inside editor
 */
export const CompleteEditor = ({
  instanceId = "default",
  pageId, // eslint-disable-line no-unused-vars
  initialContent,
  onSave,
  onChange,
  config = {},
  className = "",
  editable = true,
  showBubbleMenu = true,
  children,
  ...props
}) => {
  return (
    <EditorProvider config={config} onSave={onSave} onChange={onChange} autoSave={false}>
      <Editor
        instanceId={instanceId}
        initialContent={initialContent}
        editable={editable}
        className={`complete-editor ${className}`}
        {...props}
      >
        {/* 🎨 BubbleMenu: Shows when text is selected (conditionally rendered) */}
        {showBubbleMenu && <BubbleMenu />}
        {/* ⚡ SlashMenu: Shows when user types "/" (only when editable) */}
        {editable && <SlashMenu />}
        {/* 🔧 Any additional components you want to add */}
        {children}
      </Editor>
    </EditorProvider>
  );
};

/**
 * 🎯 MinimalEditor - The Lightweight Option
 *
 * A stripped-down editor for simple text editing needs.
 * No menus, no fancy features - just clean text editing.
 *
 * 💡 Perfect for:
 * - Comment boxes
 * - Simple text fields
 * - Read-only content display
 * - When you want to add your own custom UI
 *
 * 📝 Example usage:
 * ```jsx
 * <MinimalEditor
 *   instanceId="comment-editor"
 *   initialContent={commentText}
 *   className="border rounded p-2"
 * />
 * ```
 *
 * @param {string} instanceId - Unique ID for this editor
 * @param {Object} initialContent - Starting content
 * @param {Object} config - Custom configuration
 * @param {string} className - Additional CSS classes
 */
export const MinimalEditor = ({
  instanceId = "minimal",
  initialContent,
  config = {},
  className = "",
  ...props
}) => {
  return (
    <EditorProvider config={config}>
      <Editor
        instanceId={instanceId}
        initialContent={initialContent}
        className={`minimal-editor ${className}`}
        {...props}
      />
    </EditorProvider>
  );
};

/**
 * 🏭 createConfiguredEditor - Editor Factory Function
 *
 * This is a "factory" that creates custom editor components with pre-set configurations.
 * Think of it as a template maker - you define the defaults once, then reuse them.
 *
 * 💡 Why use this?
 * - Consistency: All your editors have the same base settings
 * - DRY: Don't repeat configuration across your app
 * - Flexibility: Still allows per-instance customization
 *
 * 📝 Example usage:
 * ```jsx
 * // Create a blog editor with specific defaults
 * const BlogEditor = createConfiguredEditor({
 *   placeholder: { text: "Write your blog post..." },
 *   characterLimit: 5000,
 *   autofocus: true
 * });
 *
 * // Use it anywhere
 * <BlogEditor instanceId="blog-post" onSave={saveBlogPost} />
 * ```
 *
 * @param {Object} defaultConfig - The default configuration for all instances
 * @returns {Function} A configured editor component
 */
export const createConfiguredEditor = (defaultConfig = {}) => {
  return function ConfiguredEditor({ config = {}, ...props }) {
    // Merge the default config with any instance-specific config
    const mergedConfig = { ...defaultConfig, ...config };

    return <CompleteEditor config={mergedConfig} {...props} />;
  };
};

/**
 * Editor Presets
 * Pre-configured editor variants for common use cases
 */
export const EditorPresets = {
  /**
   * Documentation Editor
   * Optimized for documentation writing
   */
  Documentation: createConfiguredEditor({
    placeholder: {
      text: "Start writing your documentation...",
    },
    characterLimit: 50000,
    extensions: ["details", "code-block", "task-list"],
  }),

  /**
   * Blog Editor
   * Optimized for blog post writing
   */
  Blog: createConfiguredEditor({
    placeholder: {
      text: "Tell your story...",
    },
    characterLimit: 20000,
    extensions: ["highlight", "custom-link"],
  }),

  /**
   * Note Taking Editor
   * Optimized for quick note taking
   */
  Notes: createConfiguredEditor({
    placeholder: {
      text: "Jot down your thoughts...",
    },
    characterLimit: 10000,
    autoSave: {
      enabled: true,
      delay: 1000, // Faster auto-save for notes
    },
  }),

  /**
   * Comment Editor
   * Minimal editor for comments
   */
  Comment: createConfiguredEditor({
    placeholder: {
      text: "Add a comment...",
    },
    characterLimit: 2000,
    extensions: ["bold", "italic", "custom-link"],
  }),
};

/**
 * Editor Utilities
 * Utility functions for working with editor content
 */
export const EditorUtils = {
  /**
   * Create empty document
   * @returns {Object} Empty TipTap document
   */
  createEmptyDocument: () => ({
    type: "doc",
    content: [],
  }),

  /**
   * Create document with text
   * @param {string} text - Text content
   * @returns {Object} TipTap document with text
   */
  createTextDocument: (text) => ({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text,
          },
        ],
      },
    ],
  }),

  /**
   * Extract plain text from document
   * @param {Object} doc - TipTap document
   * @returns {string} Plain text
   */
  extractText: (doc) => {
    return EditorService.extractTextFromContent(doc);
  },

  /**
   * Get document statistics
   * @param {Object} doc - TipTap document
   * @returns {Object} Document statistics
   */
  getStats: (doc) => {
    return EditorService.getContentStats(doc);
  },

  /**
   * Validate document
   * @param {Object} doc - TipTap document
   * @returns {Object} Validation result
   */
  validate: (doc) => {
    return EditorService.validateContent(doc);
  },
};

/**
 * Default export - Complete Editor System
 */
export default CompleteEditor;
