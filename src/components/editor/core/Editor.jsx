"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useEditorContext } from "./EditorProvider";
import { getInstanceConfig } from "./EditorConfig";
import { ExtensionRegistry } from "../extensions";
import { Spinner } from "@/components/ui/spinner";

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
export const Editor = ({
  instanceId,
  initialContent = null,
  extensions = [],
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
  
  // Local state
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs
  const editorRef = useRef(null);
  const saveCallbackRef = useRef(onSave);
  
  // Update save callback ref when prop changes
  useEffect(() => {
    saveCallbackRef.current = onSave;
  }, [onSave]);
  
  // Get instance-specific configuration
  const instanceConfig = getInstanceConfig(instanceId, {
    ...editorContext.config,
    ...config,
    editorProps: {
      ...editorContext.config.editorProps,
      ...config.editorProps,
      editable: () => editable,
    },
  });

  /**
   * Save handler for this editor instance
   * @param {Object} content - Editor content to save
   * @returns {Promise<void>}
   */
  const handleSave = useCallback(async (content) => {
    if (saveCallbackRef.current) {
      try {
        await saveCallbackRef.current(content, instanceId);
      } catch (error) {
        console.error(`Save failed for editor ${instanceId}:`, error);
        throw error;
      }
    }
  }, [instanceId]);

  /**
   * Load extensions for this editor instance
   * @returns {Promise<Array>} Array of TipTap extensions
   */
  const loadExtensions = useCallback(async () => {
    try {
      // Load base extensions
      const baseExtensions = await ExtensionRegistry.getBaseExtensions();
      
      // Load additional extensions if specified
      const additionalExtensions = await Promise.all(
        extensions.map(ext => {
          if (typeof ext === "string") {
            return ExtensionRegistry.getExtension(ext);
          }
          return Promise.resolve(ext);
        })
      );
      
      return [...baseExtensions, ...additionalExtensions.filter(Boolean)];
    } catch (error) {
      console.error("Failed to load extensions:", error);
      setError(error);
      return [];
    }
  }, [extensions]);

  // Initialize TipTap editor
  const editor = useEditor({
    ...instanceConfig,
    content: initialContent,
    extensions: [], // Will be set after loading
    onCreate: ({ editor }) => {
      editorRef.current = editor;
      setIsInitialized(true);
      
      // Register with context
      editorContext.registerEditor(instanceId, editor, handleSave);
      
      // Focus if configured
      if (instanceConfig.autofocus) {
        editor.commands.focus("end");
      }
    },
    onUpdate: ({ editor }) => {
      // Call onChange callback if provided
      if (onChange) {
        onChange(editor.getJSON(), instanceId);
      }
    },
    onFocus: ({ editor, event }) => {
      if (onFocus) {
        onFocus(editor, event, instanceId);
      }
    },
    onBlur: ({ editor, event }) => {
      if (onBlur) {
        onBlur(editor, event, instanceId);
      }
    },
    onDestroy: () => {
      // Unregister from context
      editorContext.unregisterEditor(instanceId);
      setIsInitialized(false);
    },
  });

  // Load extensions and configure editor
  useEffect(() => {
    let isMounted = true;
    
    const initializeEditor = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load extensions
        const loadedExtensions = await loadExtensions();
        
        if (!isMounted) return;
        
        // Configure editor with extensions
        if (editor && loadedExtensions.length > 0) {
          // Recreate editor with extensions
          editor.destroy();
          
          // Create new editor with extensions
          const newEditor = useEditor({
            ...instanceConfig,
            content: initialContent,
            extensions: loadedExtensions,
            onCreate: ({ editor }) => {
              editorRef.current = editor;
              setIsInitialized(true);
              
              // Register with context
              editorContext.registerEditor(instanceId, editor, handleSave);
              
              // Focus if configured
              if (instanceConfig.autofocus) {
                editor.commands.focus("end");
              }
            },
            onUpdate: ({ editor }) => {
              if (onChange) {
                onChange(editor.getJSON(), instanceId);
              }
            },
            onFocus: ({ editor, event }) => {
              if (onFocus) {
                onFocus(editor, event, instanceId);
              }
            },
            onBlur: ({ editor, event }) => {
              if (onBlur) {
                onBlur(editor, event, instanceId);
              }
            },
            onDestroy: () => {
              editorContext.unregisterEditor(instanceId);
              setIsInitialized(false);
            },
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        if (isMounted) {
          console.error("Failed to initialize editor:", error);
          setError(error);
          setIsLoading(false);
        }
      }
    };
    
    initializeEditor();
    
    return () => {
      isMounted = false;
    };
  }, [instanceId, extensions, initialContent]); // Re-run when key props change

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50/50 rounded-md">
        <Spinner className="text-primary" size="large">
          <span className="ml-2 text-sm text-gray-600">Loading editor...</span>
        </Spinner>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-red-50 rounded-md border border-red-200">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load editor</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Handle case where editor is not initialized
  if (!editor || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50/50 rounded-md">
        <Spinner className="text-primary" size="medium">
          <span className="ml-2 text-sm text-gray-600">Initializing...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div
      className={`editor-container ${className}`}
      style={style}
      data-editor-id={instanceId}
      {...props}
    >
      {/* Render child components (menus, toolbars, etc.) */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { editor, instanceId });
        }
        return child;
      })}
      
      {/* Main editor content */}
      <EditorContent
        editor={editor}
        className="editor-content"
      />
    </div>
  );
};

/**
 * Default export
 */
export default Editor;
