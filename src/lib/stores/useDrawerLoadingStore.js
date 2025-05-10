// stores/useDrawerLoadingStore.js
import { create } from "zustand";

export const useDrawerLoadingStore = create((set) => ({
	isDrawerReady: false,
	markDrawerReady: () => set({ isDrawerReady: true }),
	resetDrawerLoading: () => set({ isDrawerReady: false }),
}));
