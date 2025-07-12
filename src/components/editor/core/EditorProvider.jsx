"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { DEFAULT_EDITOR_CONFIG, mergeConfig } from "./EditorConfig";

/**
 * 🏗️ Editor Context Provider - The Command Center
 *
 * This is like the "mission control" for all your editors. It manages multiple editor
 * instances, handles saving/loading, and provides shared utilities.
 *
 * 🎯 What this provider does:
 * - Manages multiple editor instances on the same page
 * - Handles auto-save functionality (if enabled)
 * - Provides shared configuration across all editors
 * - Tracks unsaved changes and loading states
 * - Offers utilities like "save all editors" or "focus specific editor"
 *
 * 💡 Why use a provider?
 * - Avoid prop drilling (passing editor state through many components)
 * - Share functionality between multiple editors
 * - Centralized state management (easier to debug and maintain)
 * - Global operations (save all, clear all, etc.)
 *
 * 📝 Example usage:
 * ```jsx
 * <EditorProvider onSave={handleSave} autoSave={false}>
 *   <Editor instanceId="main-editor" />
 *   <Editor instanceId="sidebar-notes" />
 * </EditorProvider>
 * ```
 */

/**
 * Editor Context
 * @type {React.Context}
 */
const EditorContext = createContext(null);

/**
 * 📋 EditorProvider Props - How to configure the provider
 *
 * @param {ReactNode} children - Your editor components and other UI
 *   - Usually contains <Editor> components and related UI
 *   - All children can access the editor context
 *
 * @param {Object} config - Global configuration for all editors
 *   - Settings that apply to every editor in this provider
 *   - Individual editors can still override these settings
 *   - Example: { characterLimit: 5000, placeholder: { text: "Start writing..." } }
 *
 * @param {Function} onSave - Global save handler for all editors
 *   - Called when any editor in this provider saves
 *   - Receives (content, instanceId) as parameters
 *   - Example: (content, editorId) => saveToDatabase(editorId, content)
 *
 * @param {Function} onLoad - Global load handler (currently unused but ready for future)
 *   - Would be called when editors need to load content
 *
 * @param {Function} onChange - Global change handler for all editors
 *   - Called whenever any editor content changes
 *   - Useful for tracking unsaved changes across multiple editors
 *   - Example: (content, editorId) => markAsUnsaved(editorId)
 *
 * @param {boolean} autoSave - Enable automatic saving
 *   - true: Automatically saves after user stops typing (with delay)
 *   - false: Only saves when user manually triggers save (Ctrl+S, save button)
 *   - Default: true
 *
 * @param {number} autoSaveDelay - How long to wait before auto-saving (milliseconds)
 *   - Only used when autoSave is true
 *   - Default: 2000 (2 seconds)
 *   - Prevents saving on every keystroke
 */
export const EditorProvider = ({
  children,
  config = {},
  onSave,
  onLoad,
  onChange,
  autoSave = true,
  autoSaveDelay = 2000,
}) => {
  // Merge user config with defaults - memoized to prevent infinite loops
  const editorConfig = useMemo(() => mergeConfig(config), [config]);

  // Editor instances registry
  const [editors, setEditors] = useState(new Map());

  // Global editor state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save timer ref
  const autoSaveTimer = useRef(null);
  const saveCallbacks = useRef(new Map());

  /**
   * Register an editor instance
   * @param {string} instanceId - Unique identifier for the editor instance
   * @param {Object} editor - TipTap editor instance
   * @param {Function} saveCallback - Save function for this instance
   */
  const registerEditor = useCallback(
    (instanceId, editor, saveCallback) => {
      setEditors((prev) => new Map(prev.set(instanceId, editor)));

      if (saveCallback) {
        saveCallbacks.current.set(instanceId, saveCallback);
      }

      // Set up change listener (always, not just for auto-save)
      if (editor) {
        const handleUpdate = () => {
          setHasUnsavedChanges(true);

          // Auto-save logic (only if enabled)
          if (autoSave) {
            // Clear existing timer
            if (autoSaveTimer.current) {
              clearTimeout(autoSaveTimer.current);
            }

            // Set new timer
            autoSaveTimer.current = setTimeout(() => {
              handleAutoSave(instanceId);
            }, autoSaveDelay);
          }

          // Call onChange callback if provided (always, regardless of autoSave)
          if (onChange) {
            onChange(editor.getJSON(), instanceId);
          }
        };

        editor.on("update", handleUpdate);

        // Return cleanup function
        return () => {
          editor.off("update", handleUpdate);
        };
      }
    },
    [autoSave, autoSaveDelay, onChange]
  );

  /**
   * Unregister an editor instance
   * @param {string} instanceId - Unique identifier for the editor instance
   */
  const unregisterEditor = useCallback(
    (instanceId) => {
      // Check if the editor exists before attempting to remove it
      let editorExists = false;
      setEditors((prev) => {
        editorExists = prev.has(instanceId);
        return prev; // Return unchanged for now
      });

      if (!editorExists) {
        // Silently return if editor doesn't exist to prevent infinite loops
        return;
      }

      // Remove editor from registry and clean up associated resources
      setEditors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(instanceId);

        // Clear auto-save timer if this was the last editor
        if (newMap.size === 0 && autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
          autoSaveTimer.current = null;
        }

        return newMap;
      });

      // Clean up save callback for this instance
      saveCallbacks.current.delete(instanceId);
    },
    [] // Remove the dependency on editors.size to prevent infinite loops
  );

  /**
   * Get editor instance by ID
   * @param {string} instanceId - Editor instance identifier
   * @returns {Object|null} TipTap editor instance or null
   */
  const getEditor = useCallback(
    (instanceId) => {
      // Get editor from current state without depending on editors in closure
      let editor = null;
      setEditors((currentEditors) => {
        editor = currentEditors.get(instanceId) || null;
        return currentEditors; // Return unchanged
      });
      return editor;
    },
    [] // Remove editors dependency to prevent infinite loops
  );

  /**
   * Handle auto-save for a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   */
  const handleAutoSave = useCallback(
    async (instanceId) => {
      const saveCallback = saveCallbacks.current.get(instanceId);

      // Get editor from current state instead of depending on editors in closure
      let editor;
      setEditors((currentEditors) => {
        editor = currentEditors.get(instanceId);
        return currentEditors; // Return unchanged
      });

      if (!saveCallback || !editor) return;

      try {
        setIsSaving(true);

        const content = editor.getJSON();
        await saveCallback(content);

        setHasUnsavedChanges(false);
        setLastSaved(new Date());

        if (onSave) {
          onSave(content, instanceId);
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
        // Keep unsaved changes flag true on error
      } finally {
        setIsSaving(false);
      }
    },
    [onSave] // Remove editors dependency to prevent infinite loops
  );

  /**
   * Manually save a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   * @returns {Promise<boolean>} Success status
   */
  const saveEditor = useCallback(
    async (instanceId) => {
      const saveCallback = saveCallbacks.current.get(instanceId);

      // Get editor from current state instead of depending on editors in closure
      let editor;
      setEditors((currentEditors) => {
        editor = currentEditors.get(instanceId);
        return currentEditors; // Return unchanged
      });

      if (!saveCallback || !editor) {
        // Return false if save callback or editor not found
        return false;
      }

      try {
        setIsSaving(true);

        const content = editor.getJSON();
        await saveCallback(content);

        setHasUnsavedChanges(false);
        setLastSaved(new Date());

        if (onSave) {
          onSave(content, instanceId);
        }

        return true;
      } catch (error) {
        // Handle manual save errors gracefully
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [onSave] // Remove editors dependency to prevent infinite loops
  );

  /**
   * Save all registered editor instances
   * @returns {Promise<boolean>} Success status for all saves
   */
  const saveAllEditors = useCallback(async () => {
    // Get current editor keys without depending on editors in closure
    let editorKeys;
    setEditors((currentEditors) => {
      editorKeys = Array.from(currentEditors.keys());
      return currentEditors; // Return unchanged
    });

    const savePromises = editorKeys.map((instanceId) => saveEditor(instanceId));

    try {
      const results = await Promise.all(savePromises);
      return results.every((result) => result === true);
    } catch (error) {
      console.error("Failed to save all editors:", error);
      return false;
    }
  }, [saveEditor]); // Remove editors dependency to prevent infinite loops

  /**
   * Load content into a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   * @param {Object} content - Content to load
   */
  const loadContent = useCallback(
    async (instanceId, content) => {
      // Get editor from current state without depending on editors in closure
      let editor;
      setEditors((currentEditors) => {
        editor = currentEditors.get(instanceId);
        return currentEditors; // Return unchanged
      });

      if (!editor) {
        // Silently return if editor instance not found
        return;
      }

      try {
        setIsLoading(true);

        // Clear existing content and load new content
        editor.commands.setContent(content || "");
        editor.commands.focus("end");

        setHasUnsavedChanges(false);

        if (onLoad) {
          onLoad(content, instanceId);
        }
      } catch (error) {
        // Handle content loading errors gracefully
      } finally {
        setIsLoading(false);
      }
    },
    [onLoad] // Remove editors dependency to prevent infinite loops
  );

  /**
   * Clear content from a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   */
  const clearContent = useCallback(
    (instanceId) => {
      // Get editor from current state without depending on editors in closure
      let editor;
      setEditors((currentEditors) => {
        editor = currentEditors.get(instanceId);
        return currentEditors; // Return unchanged
      });

      if (!editor) {
        // Silently return if editor instance not found
        return;
      }

      // Clear editor content and focus for continued editing
      editor.commands.clearContent();
      editor.commands.focus();
      setHasUnsavedChanges(true);
    },
    [] // Remove editors dependency to prevent infinite loops
  );

  /**
   * Focus a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   * @param {string|number} position - Focus position ('start', 'end', or number)
   */
  const focusEditor = useCallback(
    (instanceId, position = "end") => {
      // Get editor from current state without depending on editors in closure
      let editor;
      setEditors((currentEditors) => {
        editor = currentEditors.get(instanceId);
        return currentEditors; // Return unchanged
      });

      if (!editor) {
        // Silently return if editor instance not found
        return;
      }

      if (typeof position === "number") {
        editor.commands.focus(position);
      } else {
        editor.commands.focus(position);
      }
    },
    [] // Remove editors dependency to prevent infinite loops
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  // Compute editor-related values without depending on editors Map
  const editorKeys = useMemo(() => Array.from(editors.keys()), [editors.size]);
  const editorCount = editors.size;

  // Context value - memoized to prevent infinite loops
  const contextValue = useMemo(
    () => ({
      // Configuration
      config: editorConfig,

      // Editor management
      registerEditor,
      unregisterEditor,
      getEditor,

      // Content operations
      loadContent,
      clearContent,
      focusEditor,

      // Save operations
      saveEditor,
      saveAllEditors,

      // State
      editors: editorKeys,
      isLoading,
      isSaving,
      lastSaved,
      hasUnsavedChanges,

      // Utilities
      editorCount,
    }),
    [
      editorConfig,
      registerEditor,
      unregisterEditor,
      getEditor,
      loadContent,
      clearContent,
      focusEditor,
      saveEditor,
      saveAllEditors,
      editorKeys,
      isLoading,
      isSaving,
      lastSaved,
      hasUnsavedChanges,
      editorCount,
    ]
  );

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

/**
 * Hook to use the Editor Context
 * @returns {Object} Editor context value
 * @throws {Error} If used outside of EditorProvider
 */
export const useEditorContext = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }

  return context;
};

/**
 * Hook to use a specific editor instance
 * @param {string} instanceId - Editor instance identifier
 * @returns {Object} Editor instance and utilities
 */
export const useEditorInstance = (instanceId) => {
  const context = useEditorContext();
  const editor = context.getEditor(instanceId);

  return {
    editor,
    isRegistered: !!editor,
    save: () => context.saveEditor(instanceId),
    loadContent: (content) => context.loadContent(instanceId, content),
    clearContent: () => context.clearContent(instanceId),
    focus: (position) => context.focusEditor(instanceId, position),
  };
};
