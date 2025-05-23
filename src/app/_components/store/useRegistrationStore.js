"use client";

import { create } from "zustand";

export const useRegistrationStore = create((set) => ({
  isOpen: false,
  isPending: false,
  openDialog: () => set({ isOpen: true, isPending: false }),
  closeDialog: () => set({ isOpen: false, isPending: false }),
  showPending: () => set({ isOpen: true, isPending: true }),
}));
