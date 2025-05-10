import { create } from "zustand";

export const usePageDialogStore = create((set) => ({
	isPageDialogOpen: false,
	openPageDialog: () => set({ isPageDialogOpen: true }),
	closePageDialog: () => set({ isPageDialogOpen: false }),
	togglePageDialog: () =>
		set((state) => ({ isPageDialogOpen: !state.isPageDialogOpen })),
}));
