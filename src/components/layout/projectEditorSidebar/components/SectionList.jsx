"use client";

import { useState } from "react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import SectionItem from "./SectionItem";

export default function SectionList({ sections }) {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (sectionId) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    if (sections.length === 0) {
        return (
            <div className="p-4 mx-2 mt-4 text-xs text-gray-500 bg-gray-100 rounded">
                No sections yet. Create one to get started.
            </div>
        );
    }

    return (
        <SidebarMenu className="flex-1 px-2 mt-2 space-y-2 overflow-y-auto">
            {sections.map((section) => (
                <SectionItem
                    key={section.id}
                    section={section}
                    isOpen={!!openSections[section.id]}
                    onToggle={() => toggleSection(section.id)}
                />
            ))}
        </SidebarMenu>
    );
}