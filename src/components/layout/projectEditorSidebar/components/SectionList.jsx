"use client";

import { useState, useEffect } from "react";
import { SidebarMenu } from "@/components/ui/sidebar";
import SectionItem from "./SectionItem";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";

export default function SectionList({ sections }) {
  const [openSections, setOpenSections] = useState({});
  const selectedPage = useProjectStore((state) => state.selectedPage);

  // Initialize and update open sections when selected page changes
  useEffect(() => {
    if (selectedPage && sections?.length > 0) {
      // Find the section containing the selected page
      const sectionWithSelectedPage = sections.find((section) =>
        section.pages?.some((page) => page.id === selectedPage)
      );

      if (sectionWithSelectedPage) {
        setOpenSections((prev) => ({
          ...prev,
          [sectionWithSelectedPage.id]: true,
        }));
      }
    }
  }, [selectedPage, sections]);

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
    <SidebarMenu className="overflow-y-auto flex-1 px-2 mt-2 space-y-2">
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
