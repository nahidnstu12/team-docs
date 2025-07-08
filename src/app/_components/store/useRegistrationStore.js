"use client";

import { create } from "zustand";

export const useRegistrationStore = create((set) => ({
  isOpen: false,
  isPending: false,
  registrationSuccess: false,
  registrationData: null,
  openDialog: () => set({ isOpen: true, isPending: false }),
  closeDialog: () => set({ isOpen: false, isPending: false }),
  showPending: () => set({ isOpen: true, isPending: true }),
  setRegistrationSuccess: (data) =>
    set({
      registrationSuccess: true,
      registrationData: data,
      isOpen: false,
    }),
  resetRegistrationState: () =>
    set({
      registrationSuccess: false,
      registrationData: null,
    }),
}));
