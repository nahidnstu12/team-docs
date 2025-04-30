"use client";

import { create } from "zustand";

export const useProjectStore = create((set) => ({
	project: null,
	sections: [],
	setProject: (project) => set({ project }),
	setSections: (sections) => set({ sections }),
}));
