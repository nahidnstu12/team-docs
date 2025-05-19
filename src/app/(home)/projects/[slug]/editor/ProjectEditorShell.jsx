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
	
	// Handle URL query parameters on initial load
	useEffect(() => {
		// Only proceed if we have sections
		if (!sections || sections.length === 0) return;
		
		const sectionParam = searchParams.get('section');
		const pageParam = searchParams.get('page');
		
		// Find the section by name
		if (sectionParam) {
			const sectionMatch = sections.find(section => 
				section.name === sectionParam);
				
			if (sectionMatch) {
				// Set the selected section in the store
				setSelectedSection(sectionMatch.id);
				
				// If there's also a page parameter, try to find and select that page
				if (pageParam && sectionMatch.pages && sectionMatch.pages.length > 0) {
					const pageMatch = sectionMatch.pages.find(page => 
						(page.title || "Untitled Page") === pageParam);
						
					if (pageMatch) {
						setSelectedPage(pageMatch.id);
					}
				}
			}
		}
	}, [searchParams, sections, setSelectedSection, setSelectedPage]);

	return (
		<>
			<ProjectEditorLayout hasSection={hasSection} />
			<ProjectEditorDialogs
				project={project}
				selectedSectionId={selectedSectionId}
			/>
		</>
	);
}
