"use client";

import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from "react";
import { DEFAULT_EDITOR_CONFIG, mergeConfig } from "./EditorConfig";

/**
 * Editor Context
 * Provides centralized state management for the TipTap editor system
 * 
 * @fileoverview This context provider manages editor state, configuration,
 * and provides utilities for editor instances throughout the application.
 */

/**
 * Editor Context
 * @type {React.Context}
 */
const EditorContext = createContext(null);

/**
 * Editor Provider Component
 * Manages global editor state and configuration
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.config - Editor configuration overrides
 * @param {Function} props.onSave - Save callback function
 * @param {Function} props.onLoad - Load callback function
 * @param {Function} props.onChange - Change callback function
 * @param {boolean} props.autoSave - Enable auto-save functionality
 * @param {number} props.autoSaveDelay - Auto-save delay in milliseconds
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
  // Merge user config with defaults
  const editorConfig = mergeConfig(config);
  
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
  const registerEditor = useCallback((instanceId, editor, saveCallback) => {
    setEditors(prev => new Map(prev.set(instanceId, editor)));
    
    if (saveCallback) {
      saveCallbacks.current.set(instanceId, saveCallback);
    }
    
    // Set up change listener for auto-save
    if (autoSave && editor) {
      const handleUpdate = () => {
        setHasUnsavedChanges(true);
        
        // Clear existing timer
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }
        
        // Set new timer
        autoSaveTimer.current = setTimeout(() => {
          handleAutoSave(instanceId);
        }, autoSaveDelay);
        
        // Call onChange callback if provided
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
  }, [autoSave, autoSaveDelay, onChange]);

  /**
   * Unregister an editor instance
   * @param {string} instanceId - Unique identifier for the editor instance
   */
  const unregisterEditor = useCallback((instanceId) => {
    setEditors(prev => {
      const newMap = new Map(prev);
      newMap.delete(instanceId);
      return newMap;
    });
    
    saveCallbacks.current.delete(instanceId);
    
    // Clear auto-save timer if this was the last editor
    if (editors.size === 1 && autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = null;
    }
  }, [editors.size]);

  /**
   * Get editor instance by ID
   * @param {string} instanceId - Editor instance identifier
   * @returns {Object|null} TipTap editor instance or null
   */
  const getEditor = useCallback((instanceId) => {
    return editors.get(instanceId) || null;
  }, [editors]);

  /**
   * Handle auto-save for a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   */
  const handleAutoSave = useCallback(async (instanceId) => {
    const saveCallback = saveCallbacks.current.get(instanceId);
    const editor = editors.get(instanceId);
    
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
  }, [editors, onSave]);

  /**
   * Manually save a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   * @returns {Promise<boolean>} Success status
   */
  const saveEditor = useCallback(async (instanceId) => {
    const saveCallback = saveCallbacks.current.get(instanceId);
    const editor = editors.get(instanceId);
    
    if (!saveCallback || !editor) {
      console.warn(`No save callback or editor found for instance: ${instanceId}`);
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
      console.error("Manual save failed:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [editors, onSave]);

  /**
   * Save all registered editor instances
   * @returns {Promise<boolean>} Success status for all saves
   */
  const saveAllEditors = useCallback(async () => {
    const savePromises = Array.from(editors.keys()).map(instanceId => 
      saveEditor(instanceId)
    );
    
    try {
      const results = await Promise.all(savePromises);
      return results.every(result => result === true);
    } catch (error) {
      console.error("Failed to save all editors:", error);
      return false;
    }
  }, [editors, saveEditor]);

  /**
   * Load content into a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   * @param {Object} content - Content to load
   */
  const loadContent = useCallback(async (instanceId, content) => {
    const editor = editors.get(instanceId);
    
    if (!editor) {
      console.warn(`No editor found for instance: ${instanceId}`);
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
      console.error("Failed to load content:", error);
    } finally {
      setIsLoading(false);
    }
  }, [editors, onLoad]);

  /**
   * Clear content from a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   */
  const clearContent = useCallback((instanceId) => {
    const editor = editors.get(instanceId);
    
    if (!editor) {
      console.warn(`No editor found for instance: ${instanceId}`);
      return;
    }
    
    editor.commands.clearContent();
    editor.commands.focus();
    setHasUnsavedChanges(true);
  }, [editors]);

  /**
   * Focus a specific editor instance
   * @param {string} instanceId - Editor instance identifier
   * @param {string|number} position - Focus position ('start', 'end', or number)
   */
  const focusEditor = useCallback((instanceId, position = "end") => {
    const editor = editors.get(instanceId);
    
    if (!editor) {
      console.warn(`No editor found for instance: ${instanceId}`);
      return;
    }
    
    if (typeof position === "number") {
      editor.commands.focus(position);
    } else {
      editor.commands.focus(position);
    }
  }, [editors]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  // Context value
  const contextValue = {
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
    editors: Array.from(editors.keys()),
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    
    // Utilities
    editorCount: editors.size,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
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
