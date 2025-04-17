"use client";

import { createContext, useContext, useState } from "react";

const SidebarToggleContext = createContext();

export function SidebarToggleProvider({ children }) {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen((prev) => !prev);

	return (
		<SidebarToggleContext.Provider value={{ isOpen, toggle }}>
			{children}
		</SidebarToggleContext.Provider>
	);
}

// useSidebarToggle.jsx
export const useSidebarToggle = () => {
	const context = useContext(SidebarToggleContext);
	if (!context) {
		throw new Error(
			"useSidebarToggle must be used within a SidebarToggleProvider"
		);
	}
	return context;
};
