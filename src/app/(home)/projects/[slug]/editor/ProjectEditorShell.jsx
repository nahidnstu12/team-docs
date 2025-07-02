"use client";

import ProjectEditorLayout from "./ProjectEditorLayout";
import ProjectEditorDialogs from "./ProjectEditorDialogs";
import { useEffect } from "react";
import { useProjectStore } from "../../store/useProjectStore";
import { useSearchParams } from "next/navigation";

export default function ProjectEditorShell({ hasSection, project, sections }) {
  const searchParams = useSearchParams();
  const setProject = useProjectStore((state) => state.setProject);
  const setSections = useProjectStore((state) => state.setSections);
  const setSelectedSection = useProjectStore((state) => state.setSelectedSection);
  const setSelectedPage = useProjectStore((state) => state.setSelectedPage);
  const selectedSectionId = useProjectStore((state) => state.selectedSection);

  useEffect(() => {
    setProject(project);
    setSections(sections);
  }, [project, setProject, setSections, sections]);

  // Handle URL query parameters on initial load (for backward compatibility)
  // This maintains deep linking functionality while using store persistence
  useEffect(() => {
    // Only proceed if we have sections
    if (!sections || sections.length === 0) return;

    const sectionParam = searchParams.get("section");
    const pageParam = searchParams.get("page");

    // Only process URL params if they exist (for deep linking)
    if (sectionParam) {
      const selectByNames = useProjectStore.getState().selectByNames;
      selectByNames(sectionParam, pageParam);
    }
  }, [searchParams, sections]);

  return (
    <>
      <ProjectEditorLayout hasSection={hasSection} />
      <ProjectEditorDialogs project={project} selectedSectionId={selectedSectionId} />
    </>
  );
}
