"use client";

import ProjectEditorLayout from "./ProjectEditorLayout";
import ProjectEditorDialogs from "./ProjectEditorDialogs";
import { useEffect } from "react";
import { useProjectStore } from "../../store/useProjectStore";

export default function ProjectEditorShell({ hasSection, project, sections }) {
	const setProject = useProjectStore((state) => state.setProject);
	const setSections = useProjectStore((state) => state.setSections);
	const selectedSectionId = useProjectStore((state) => state.selectedSection);

	useEffect(() => {
		setProject(project);
		setSections(sections);
	}, [project, setProject, setSections, sections]);

	return (
		<>
			<ProjectEditorLayout
				hasSection={hasSection}
				project={project}
				sections={sections}
			/>
			<ProjectEditorDialogs
				project={project}
				selectedSectionId={selectedSectionId}
			/>
		</>
	);
}
