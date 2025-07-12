"use client";

import { create } from "zustand";

/**
 * Store that manages the state of the page dialog modal.
 * This store controls the visibility state of the page dialog across components.
 */
export const usePageDialogStore = create((set) => ({
	/**
	 * Boolean flag indicating whether the page dialog is currently open.
	 * @type {boolean}
	 */
	isPageDialogOpen: false,

	/**
	 * Opens the page dialog by setting isPageDialogOpen to true.
	 */
	openPageDialog: () => set({ isPageDialogOpen: true }),

	/**
	 * Closes the page dialog by setting isPageDialogOpen to false.
	 */
	closePageDialog: () => set({ isPageDialogOpen: false }),

	/**
	 * Toggles the page dialog's open state.
	 * If the dialog is open, it will close, and if it's closed, it will open.
	 */
	togglePageDialog: () =>
		set((state) => ({ isPageDialogOpen: !state.isPageDialogOpen })),
}));
