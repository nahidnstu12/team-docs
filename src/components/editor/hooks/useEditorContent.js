"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { EditorService } from "../services/EditorService";

/**
 * useEditorContent Hook
 * Manages editor content loading, saving, and state
 *
 * @fileoverview This hook provides content management functionality
 * for TipTap editor instances, including loading, saving, and validation.
 */

/**
 * useEditorContent Hook
 *
 * @param {Object} options - Hook options
 * @param {string} options.pageId - Page identifier for content
 * @param {Object} options.initialContent - Initial content to load
 * @param {boolean} options.autoSave - Enable auto-save functionality
 * @param {number} options.autoSaveDelay - Auto-save delay in milliseconds
 * @param {Function} options.onSave - Callback when content is saved
 * @param {Function} options.onLoad - Callback when content is loaded
 * @param {Function} options.onError - Callback when an error occurs
 * @returns {Object} Content management state and functions
 */
export const useEditorContent = ({
  pageId,
  initialContent = null,
  autoSave = true,
  autoSaveDelay = 2000,
  onSave,
  onLoad,
  onError,
} = {}) => {
  // State management
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({});

  // Refs for managing timers and callbacks
  const autoSaveTimer = useRef(null);
  const saveCallbackRef = useRef(onSave);
  const loadCallbackRef = useRef(onLoad);
  const errorCallbackRef = useRef(onError);

  // Update callback refs when props change
  useEffect(() => {
    saveCallbackRef.current = onSave;
    loadCallbackRef.current = onLoad;
    errorCallbackRef.current = onError;
  }, [onSave, onLoad, onError]);

  /**
   * Load content from server
   * @param {string} targetPageId - Page ID to load (defaults to current pageId)
   * @returns {Promise<boolean>} Success status
   */
  const loadContent = useCallback(
    async (targetPageId = pageId) => {
      if (!targetPageId) {
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        const result = await EditorService.loadContent(targetPageId);

        if (result.success) {
          setContent(result.data.content);
          setMetadata(result.data.metadata || {});
          setHasUnsavedChanges(false);

          if (loadCallbackRef.current) {
            loadCallbackRef.current(result.data.content, targetPageId);
          }

          return true;
        } else {
          throw new Error(result.error || "Failed to load content");
        }
      } catch (err) {
        const errorMessage = err.message || "Failed to load content";
        setError(errorMessage);

        if (errorCallbackRef.current) {
          errorCallbackRef.current(err, "load");
        }

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [pageId]
  );

  /**
   * Save content to server
   * @param {Object} contentToSave - Content to save (defaults to current content)
   * @param {Object} additionalMetadata - Additional metadata to include
   * @returns {Promise<boolean>} Success status
   */
  const saveContent = useCallback(
    async (contentToSave = content, additionalMetadata = {}) => {
      // Validate required parameters before attempting save
      if (!pageId) {
        return false;
      }

      if (!contentToSave) {
        return false;
      }

      try {
        setIsSaving(true);
        setError(null);

        const result = await EditorService.saveContent({
          pageId,
          content: contentToSave,
          metadata: {
            ...metadata,
            ...additionalMetadata,
          },
        });

        if (result.success) {
          setHasUnsavedChanges(false);
          setLastSaved(new Date());

          if (saveCallbackRef.current) {
            saveCallbackRef.current(contentToSave, pageId);
          }

          return true;
        } else {
          throw new Error(result.error || "Failed to save content");
        }
      } catch (err) {
        const errorMessage = err.message || "Failed to save content";
        setError(errorMessage);

        if (errorCallbackRef.current) {
          errorCallbackRef.current(err, "save");
        }

        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [pageId, content, metadata]
  );

  /**
   * Update content and trigger auto-save if enabled
   * @param {Object} newContent - New content to set
   * @param {boolean} markAsChanged - Whether to mark as having unsaved changes
   */
  const updateContent = useCallback(
    (newContent, markAsChanged = true) => {
      setContent(newContent);

      if (markAsChanged) {
        setHasUnsavedChanges(true);

        // Clear existing auto-save timer
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }

        // Set new auto-save timer if enabled
        if (autoSave && pageId) {
          autoSaveTimer.current = setTimeout(() => {
            saveContent(newContent);
          }, autoSaveDelay);
        }
      }
    },
    [autoSave, autoSaveDelay, pageId, saveContent]
  );

  /**
   * Clear content
   */
  const clearContent = useCallback(() => {
    setContent(null);
    setHasUnsavedChanges(true);
    setMetadata({});
  }, []);

  /**
   * Reset to last saved state
   */
  const resetContent = useCallback(() => {
    if (pageId) {
      loadContent(pageId);
    } else {
      setContent(initialContent);
      setHasUnsavedChanges(false);
    }
  }, [pageId, initialContent, loadContent]);

  /**
   * Get content statistics
   * @returns {Object} Content statistics
   */
  const getContentStats = useCallback(() => {
    if (!content) {
      return {
        wordCount: 0,
        characterCount: 0,
        paragraphCount: 0,
        headingCount: 0,
      };
    }

    return EditorService.getContentStats(content);
  }, [content]);

  /**
   * Validate current content
   * @returns {Object} Validation result
   */
  const validateContent = useCallback(() => {
    if (!content) {
      return { isValid: true, errors: [] };
    }

    return EditorService.validateContent(content);
  }, [content]);

  // Load initial content when pageId changes
  useEffect(() => {
    if (pageId && !initialContent) {
      loadContent(pageId);
    } else if (initialContent) {
      setContent(initialContent);
      setHasUnsavedChanges(false);
    }
  }, [pageId, initialContent, loadContent]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  // Auto-save when component unmounts if there are unsaved changes
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges && autoSave && pageId && content) {
        // Fire and forget save on unmount
        EditorService.saveContent({
          pageId,
          content,
          metadata,
        }).catch(() => {
          // Silently handle auto-save errors on unmount
        });
      }
    };
  }, [hasUnsavedChanges, autoSave, pageId, content, metadata]);

  return {
    // Content state
    content,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    lastSaved,
    error,
    metadata,

    // Content operations
    loadContent,
    saveContent,
    updateContent,
    clearContent,
    resetContent,

    // Utilities
    getContentStats,
    validateContent,

    // Status helpers
    isReady: !isLoading && !error,
    isEmpty:
      !content ||
      (typeof content === "object" && (!content.content || content.content.length === 0)),
  };
};
