"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import { useEffect, useState } from "react";
import CreateSectionDialog from "./components/CreateSectionDialog";
import NoSectionUI from "./components/NoSectionUI";
import { useProjectStore } from "../../store/useProjectStore";
import Logger from "@/lib/Logger";

export default function ProjectEditorShell({ hasSection, project, sections }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const setProject = useProjectStore((state) => state.setProject);
	const setSections = useProjectStore((state) => state.setSections);
	const sectionListings = useProjectStore((state) => state.sections);

	Logger.success(sectionListings, "from  zustand");

	useEffect(() => {
		setProject(project);
		setSections(sections);
	}, [project, setProject, setSections, sections]);

	return (
		<>
			<ProjectEditorHeader
				hasSection={hasSection}
				setIsDialogOpen={setIsDialogOpen}
			/>

			{isDialogOpen && (
				<CreateSectionDialog
					project={project}
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
				/>
			)}

			{!hasSection && <NoSectionUI setIsDialogOpen={setIsDialogOpen} />}
		</>
	);
}
