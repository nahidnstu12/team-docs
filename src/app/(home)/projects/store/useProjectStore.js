"use client";

import { create } from "zustand";

/**
 * Project store that manages the state of a project and its components.
 * This store is used across project-related components to maintain consistent state.
 */
export const useProjectStore = create((set) => ({
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
}));
