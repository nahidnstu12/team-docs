"use client";

import { create } from "zustand";

/**
 * Preview store that manages the preview state of the editor
 * This store allows toggling between edit and preview modes on a per-page basis
 */
export const usePreviewStore = create((set, get) => ({
  /**
   * Map of page IDs to their preview state
   * @type {Object<string, boolean>}
   */
  previewModePages: {},
  
  /**
   * Check if a specific page is in preview mode
   * @param {string} pageId - The ID of the page to check
   * @returns {boolean} - Whether the page is in preview mode
   */
  isPageInPreviewMode: (pageId) => {
    if (!pageId) return false;
    return get().previewModePages[pageId] || false;
  },

  /**
   * Toggle preview mode for a specific page
   * @param {string} pageId - The ID of the page to toggle preview mode for
   * @returns {void}
   */
  togglePagePreviewMode: (pageId) => {
    if (!pageId) return;
    
    set((state) => ({
      previewModePages: {
        ...state.previewModePages,
        [pageId]: !state.previewModePages[pageId]
      }
    }));
  },

  /**
   * Set preview mode for a specific page
   * @param {string} pageId - The ID of the page to set preview mode for
   * @param {boolean} value - The preview mode value to set
   * @returns {void}
   */
  setPagePreviewMode: (pageId, value) => {
    if (!pageId) return;
    
    set((state) => ({
      previewModePages: {
        ...state.previewModePages,
        [pageId]: value
      }
    }));
  },

  /**
   * Map of published page IDs
   * @type {Object<string, boolean>}
   */
  publishedPages: {},

  /**
   * Check if a specific page is published
   * @param {string} pageId - The ID of the page to check
   * @returns {boolean} - Whether the page is published
   */
  isPagePublished: (pageId) => {
    if (!pageId) return false;
    return get().publishedPages[pageId] || false;
  },

  /**
   * Set published status for a specific page
   * @param {string} pageId - The ID of the page to set published status for
   * @param {boolean} value - The published status to set
   * @returns {void}
   */
  setPagePublished: (pageId, value) => {
    if (!pageId) return;
    
    set((state) => ({
      publishedPages: {
        ...state.publishedPages,
        [pageId]: value
      }
    }));
  },
}));
