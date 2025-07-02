"use client";

import { createContext, useContext, useState } from "react";

/**
 * Active Section Context for Admin Sidebar
 * 
 * Provides state management for tracking which sidebar section and item
 * are currently active. This is used for highlighting navigation items
 * and managing collapsible sections.
 */
const ActiveSectionContext = createContext();

export function ActiveSectionProvider({ children }) {
    const [activeSection, setActiveSection] = useState("");
    const [activeItem, setActiveItem] = useState("");

    const setActive = (sectionId, itemId = "") => {
        setActiveSection(sectionId);
        setActiveItem(itemId);
    };

    const isActive = (sectionId, itemId = "") => {
        if (itemId) {
            return activeSection === sectionId && activeItem === itemId;
        }
        return activeSection === sectionId;
    };

    return (
        <ActiveSectionContext.Provider value={{ setActive, isActive }}>
            {children}
        </ActiveSectionContext.Provider>
    );
}

export function useActiveSection() {
    const context = useContext(ActiveSectionContext);
    if (!context) {
        throw new Error("useActiveSection must be used within an ActiveSectionProvider");
    }
    return context;
}
