/**
 * TipTap Editor System
 * Centralized export point for the modular TipTap editor implementation
 * 
 * @fileoverview This module provides a centralized export point for all
 * editor components, hooks, services, and utilities. It follows the new
 * modular architecture designed for scalability and maintainability.
 */

// Core editor components
export { Editor } from "./core/Editor";
export { EditorProvider, useEditorContext, useEditorInstance } from "./core/EditorProvider";
export * from "./core/EditorConfig";

// Extension system
export { ExtensionRegistry, registerExtension, loadExtension, getBaseExtensions } from "./extensions";
export * from "./extensions/custom";

// UI Components
export { BubbleMenu } from "./ui/menus/BubbleMenu";
export { SlashMenu } from "./ui/menus/SlashMenu";
export { ColorPickerPanel } from "./ui/ColorPickerPanel";
export { Toolbar } from "./ui/Toolbar";

// Hooks
export * from "./hooks";

// Services
export { EditorService } from "./services/EditorService";

// Commands
export * from "./ui/commands";

// Utilities
export * from "./utils";

/**
 * Complete Editor System
 * Pre-configured editor with all features enabled
 * 
 * @param {Object} props - Editor props
 * @returns {JSX.Element} Complete editor system
 */
export const CompleteEditor = ({
  instanceId = "default",
  pageId,
  initialContent,
  onSave,
  onChange,
  config = {},
  className = "",
  ...props
}) => {
  return (
    <EditorProvider
      config={config}
      onSave={onSave}
      onChange={onChange}
      autoSave={true}
    >
      <Editor
        instanceId={instanceId}
        initialContent={initialContent}
        className={`complete-editor ${className}`}
        {...props}
      >
        <BubbleMenu />
        <SlashMenu />
      </Editor>
    </EditorProvider>
  );
};

/**
 * Minimal Editor
 * Basic editor without menus for simple use cases
 * 
 * @param {Object} props - Editor props
 * @returns {JSX.Element} Minimal editor
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
 * Editor with Custom Configuration
 * Factory function to create editor with specific configuration
 * 
 * @param {Object} defaultConfig - Default configuration
 * @returns {Function} Configured editor component
 */
export const createConfiguredEditor = (defaultConfig = {}) => {
  return function ConfiguredEditor({
    config = {},
    ...props
  }) {
    const mergedConfig = { ...defaultConfig, ...config };
    
    return (
      <CompleteEditor
        config={mergedConfig}
        {...props}
      />
    );
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
