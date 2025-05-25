import { create } from "zustand";

export const useSectionDialogStore = create((set) => ({
	isSectionDialogOpen: false,
	openSectionDialog: () => set({ isSectionDialogOpen: true }),
	closeSectionDialog: () => set({ isSectionDialogOpen: false }),
}));
