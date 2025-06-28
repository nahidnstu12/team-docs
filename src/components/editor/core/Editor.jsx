"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useEditorContext } from "./EditorProvider";
import { DEFAULT_EDITOR_CONFIG, getInstanceConfig } from "./EditorConfig";
import { ExtensionRegistry } from "../extensions";
import { Spinner } from "@/components/ui/spinner";
import StarterKit from "@tiptap/starter-kit";

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
  const [loadedExtensions, setLoadedExtensions] = useState([]);

  // Refs
  const editorRef = useRef(null);
  const saveCallbackRef = useRef(onSave);

  // Update save callback ref when prop changes
  useEffect(() => {
    saveCallbackRef.current = onSave;
  }, [onSave]);

  // Get instance-specific configuration with comprehensive null safety
  let instanceConfig;
  try {
    console.log("Creating instanceConfig...");
    console.log("editorContext:", editorContext);
    console.log("DEFAULT_EDITOR_CONFIG:", DEFAULT_EDITOR_CONFIG);
    console.log("config:", config);

    instanceConfig = getInstanceConfig(instanceId, {
      ...(editorContext?.config || DEFAULT_EDITOR_CONFIG || {}),
      ...config,
      editorProps: {
        ...(editorContext?.config?.editorProps || DEFAULT_EDITOR_CONFIG?.editorProps || {}),
        ...(config?.editorProps || {}),
        editable: () => editable,
      },
    });

    console.log("instanceConfig created successfully:", instanceConfig);
  } catch (error) {
    console.error("❌ Error creating instanceConfig:", error);
    console.error("Error stack:", error.stack);

    // Create a minimal fallback config
    instanceConfig = {
      autofocus: true,
      editorProps: {
        attributes: {
          class: "focus:outline-none max-w-none prose prose-lg",
        },
        editable: () => editable,
      },
    };
    console.log("Using fallback instanceConfig:", instanceConfig);
  }

  // Debug logging for configuration issues
  if (process.env.NODE_ENV === "development") {
    console.log("=== COMPREHENSIVE EDITOR DEBUG ===");
    console.log("instanceId:", instanceId);
    console.log("editorContext:", editorContext);
    console.log("editorContext?.config:", editorContext?.config);
    console.log("DEFAULT_EDITOR_CONFIG:", DEFAULT_EDITOR_CONFIG);
    console.log("userConfig:", config);
    console.log("instanceConfig:", instanceConfig);
    console.log("loadedExtensions:", loadedExtensions);
    console.log("loadedExtensionsCount:", loadedExtensions.length);
    console.log("isLoading:", isLoading);
    console.log("error:", error);
    console.log("=== END DEBUG ===");

    if (!instanceConfig) {
      console.error("❌ Editor instanceConfig is null/undefined for instance:", instanceId);
    }

    if (!DEFAULT_EDITOR_CONFIG) {
      console.error("❌ DEFAULT_EDITOR_CONFIG is null/undefined!");
    }

    if (!editorContext) {
      console.error("❌ editorContext is null/undefined!");
    }
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

  // Load extensions on component mount
  useEffect(() => {
    let isMounted = true;

    const loadExtensions = async () => {
      console.log("=== Extension Loading Debug ===");
      console.log("Starting extension loading...");
      console.log("ExtensionRegistry:", ExtensionRegistry);

      try {
        setIsLoading(true);
        setError(null);

        // Load base extensions with debugging
        console.log("Calling ExtensionRegistry.getBaseExtensions()...");
        const baseExtensions = await ExtensionRegistry.getBaseExtensions();
        console.log("Base extensions loaded:", baseExtensions);
        console.log("Base extensions count:", baseExtensions?.length || 0);

        // Load additional extensions if specified
        console.log("Loading additional extensions:", extensions);
        const additionalExtensions = await Promise.all(
          extensions.map(async (ext) => {
            if (typeof ext === "string") {
              console.log("Loading extension by name:", ext);
              const loaded = await ExtensionRegistry.loadExtension(ext);
              console.log("Loaded extension:", ext, loaded);
              return loaded;
            }
            console.log("Using direct extension:", ext);
            return Promise.resolve(ext);
          })
        );

        const allExtensions = [...(baseExtensions || []), ...additionalExtensions.filter(Boolean)];
        console.log("All extensions combined:", allExtensions);
        console.log("Total extensions count:", allExtensions.length);

        if (isMounted) {
          setLoadedExtensions(allExtensions);
          setIsLoading(false);
          console.log("Extensions set in state successfully");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load extensions:", error);
          console.error("Error details:", error.message, error.stack);
          setError(error);

          // Try to set basic fallback extensions
          console.log("Attempting to use fallback extensions...");
          try {
            // Import basic TipTap extensions directly as fallback
            const { StarterKit } = await import("@tiptap/starter-kit");
            const fallbackExtensions = [StarterKit];
            console.log("Fallback extensions loaded successfully:", fallbackExtensions);
            setLoadedExtensions(fallbackExtensions);
            setIsLoading(false);
            setError(null); // Clear error since fallback worked
          } catch (fallbackError) {
            console.error("Fallback extensions also failed:", fallbackError);
            setLoadedExtensions([]);
            setIsLoading(false);
          }
        }
      }
    };

    loadExtensions();

    return () => {
      isMounted = false;
    };
  }, [extensions]);

  // Use the configuration
  const [editorConfig, setEditorConfig] = useState(null);

  useEffect(() => {
    const initConfig = async () => {
      // Only proceed if we have loaded extensions
      if (loadedExtensions.length === 0) {
        console.log("No extensions loaded yet, waiting...");
        return;
      }

      console.log("Creating editor config with extensions:", loadedExtensions.length);

      // Ensure we have at least one extension before proceeding
      if (loadedExtensions.length === 0) {
        console.log("No extensions available, cannot create editor config");
        setEditorConfig(null);
        return;
      }

      const config = {
        content: initialContent || "",
        extensions: loadedExtensions,
        editorProps: {
          attributes: {
            class: "focus:outline-none max-w-none prose prose-lg",
          },
        },
        onCreate: ({ editor }) => {
          console.log("Editor created successfully");
          editorRef.current = editor;
          setIsInitialized(true);
          editorContext?.registerEditor?.(instanceId, editor, handleSave);

          // Safe autofocus implementation
          try {
            const shouldAutofocus =
              instanceConfig?.autofocus ?? DEFAULT_EDITOR_CONFIG?.autofocus ?? true;
            if (shouldAutofocus) {
              // Use setTimeout to ensure DOM is ready
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
          editorContext?.unregisterEditor?.(instanceId);
          setIsInitialized(false);
        },
      };

      console.log("=== useEditor Debug ===");
      console.log("loadedExtensions.length:", loadedExtensions.length);
      console.log("editorConfig:", config);
      setEditorConfig(config);
    };

    initConfig();
  }, [
    loadedExtensions,
    instanceId,
    initialContent,
    instanceConfig,
    handleSave,
    onChange,
    onFocus,
    onBlur,
    editorContext,
  ]);

  // Don't use fallback config - always wait for proper extensions
  // TipTap requires proper extensions to function, empty extensions cause schema errors

  const editor = useEditor(
    editorConfig
      ? editorConfig
      : {
          immediatelyRender: false,
          extensions: [StarterKit], // Use StarterKit as fallback to provide basic schema
          content: null,
        }, // Provide minimal config when editorConfig is null
    [editorConfig] // Dependencies for re-initialization
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Handle loading state
  if (isLoading || !editorConfig) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50/50 rounded-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <span className="mt-2 text-sm text-gray-600 block">
            {isLoading ? "Loading extensions..." : "Preparing editor..."}
          </span>
        </div>
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

/**
 * Default export
 */
export default Editor;
