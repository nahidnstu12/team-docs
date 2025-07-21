"use client";

import { create } from "zustand";

export const useRegistrationStore = create((set) => ({
  isFormDialogOpen: false, // first dialog
  isPendingDialogOpen: false, // second dialog
  registrationSuccess: false,
  registrationData: null,

  openFormDialog: () => set({ isFormDialogOpen: true }),
  closeFormDialog: () => set({ isFormDialogOpen: false }),

  openPendingDialog: () => set({ isPendingDialogOpen: true }),
  closePendingDialog: () => set({ isPendingDialogOpen: false }),

  setRegistrationSuccess: (data) => {
    return set({
      registrationSuccess: true,
      registrationData: data,
      isFormDialogOpen: false,
      isPendingDialogOpen: true, // ✅ open second dialog separately
    });
  },

  resetRegistrationState: () =>
    set({
      registrationSuccess: false,
      registrationData: null,
      isPendingDialogOpen: false,
    }),
}));
