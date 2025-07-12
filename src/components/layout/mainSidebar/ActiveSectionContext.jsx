"use client";

import { createContext, useContext, useState } from "react";

const ActiveSectionContext = createContext();

export function ActiveSectionProvider({ children }) {
    const [activeSection, setActiveSection] = useState("");
    const [activeItem, setActiveItem] = useState("");

    const setActive = (section, item = "") => {
        setActiveSection(section);
        setActiveItem(item);
    };

    const isActive = (section, item = "") => {
        if (item) {
            return activeSection === section && activeItem === item;
        }
        return activeSection === section && !activeItem;
    };

    return (
        <ActiveSectionContext.Provider
            value={{ activeSection, activeItem, setActive, isActive }}
        >
            {children}
        </ActiveSectionContext.Provider>
    );
}

export function useActiveSection() {
    return useContext(ActiveSectionContext);
}