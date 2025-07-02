"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Project store that manages the state of a project and its components.
 * This store is used across project-related components to maintain consistent state.
 * Uses Zustand persistence to maintain selection state across browser refreshes.
 */
export const useProjectStore = create(
  persist(
    (set, get) => ({
      /**
       * The currently active project object containing project details.
       * @type {Object|null}
       */
      project: null,

      /**
       * Array of sections within the current project.
       * Each section represents a logical grouping of pages.
       * @type {Array<Object>}
       */
      sections: [],

      /**
       * Currently selected section in the project.
       * Used for navigation and editing context.
       * @type {Object|null}
       */
      selectedSection: null,

      /**
       * Currently selected page within the selected section.
       * Used for editing and displaying content.
       * @type {Object|null}
       */
      selectedPage: null,

      /**
       * Updates the current project object.
       * @param {Object} project - The project object to set
       */
      setProject: (project) => set({ project }),

      /**
       * Updates the array of sections for the current project.
       * @param {Array<Object>} sections - Array of section objects
       */
      setSections: (sections) => set({ sections }),

      /**
       * Sets the currently selected section.
       * @param {Object} selectedSection - The section object to select
       */
      setSelectedSection: (selectedSection) => set({ selectedSection }),

      /**
       * Sets the currently selected page.
       * @param {Object} selectedPage - The page object to select
       */
      setSelectedPage: (selectedPage) => set({ selectedPage }),

      /**
       * Function that handles saving project changes.
       * This can be set by components that need to implement save functionality.
       * @type {Function|null}
       */
      saveHandler: null,

      /**
       * Sets the save handler function.
       * @param {Function} fn - The save handler function to set
       */
      setSaveHandler: (fn) => set({ saveHandler: fn }),

      /**
       * Combined action for setting both section and page efficiently.
       * @param {string} sectionId - The section ID to select
       * @param {string} pageId - The page ID to select
       */
      setSelectedSectionAndPage: (sectionId, pageId) =>
        set({ selectedSection: sectionId, selectedPage: pageId }),

      /**
       * Helper to find and select section and page by names (for URL compatibility).
       * This maintains backward compatibility with URL-based navigation.
       * @param {string} sectionName - The section name to find
       * @param {string} pageName - The page name to find (optional)
       */
      selectByNames: (sectionName, pageName) => {
        const { sections } = get();
        if (!sections || sections.length === 0) return;

        const sectionMatch = sections.find((section) => section.name === sectionName);
        if (!sectionMatch) return;

        set({ selectedSection: sectionMatch.id });

        if (pageName && sectionMatch.pages && sectionMatch.pages.length > 0) {
          const pageMatch = sectionMatch.pages.find(
            (page) => (page.title || "Untitled Page") === pageName
          );
          if (pageMatch) {
            set({ selectedPage: pageMatch.id });
          }
        }
      },

      /**
       * Get the currently selected section data object.
       * @returns {Object|null} The selected section object or null
       */
      getSelectedSectionData: () => {
        const { sections, selectedSection } = get();
        return sections?.find((section) => section.id === selectedSection) || null;
      },

      /**
       * Get the currently selected page data object.
       * @returns {Object|null} The selected page object or null
       */
      getSelectedPageData: () => {
        const { sections, selectedSection, selectedPage } = get();
        const section = sections?.find((section) => section.id === selectedSection);
        return section?.pages?.find((page) => page.id === selectedPage) || null;
      },

      /**
       * Reset the entire store state.
       * Useful when navigating away from projects or logging out.
       */
      reset: () =>
        set({
          project: null,
          sections: [],
          selectedSection: null,
          selectedPage: null,
          saveHandler: null,
        }),
    }),
    {
      name: "project-editor-state", // unique name for localStorage key
      partialize: (state) => ({
        // Only persist selection state, not the actual data
        selectedSection: state.selectedSection,
        selectedPage: state.selectedPage,
      }),
    }
  )
);
