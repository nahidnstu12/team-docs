"use client";

import { create } from "zustand";

export const useProjectStore = create((set) => ({
	project: null,
	sections: [],
	selectedSection: null,
	selectedPage: null,
	setProject: (project) => set({ project }),
	setSections: (sections) => set({ sections }),
	setSelectedSection: (selectedSection) => set({ selectedSection }),
	setSelectedPage: (selectedPage) => set({ selectedPage }),
	saveHandler: null,
	setSaveHandler: (fn) => set({ saveHandler: fn }),
}));
