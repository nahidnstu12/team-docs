"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import { useEffect, useState } from "react";
import CreateSectionDialog from "./components/CreateSectionDialog";
import NoSectionUI from "./components/NoSectionUI";
import { useProjectStore } from "../../store/useProjectStore";
import CreatePageDialog from "./components/createPageDialog";
import { usePageDialogStore } from "../../store/usePageDialogStore";

export default function ProjectEditorShell({ hasSection, project, sections }) {
	const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);

	const isPageDialogOpen = usePageDialogStore(
		(state) => state.isPageDialogOpen
	);
	const closePageDialog = usePageDialogStore((state) => state.closePageDialog);

	const selectedSectionId = useProjectStore((state) => state.selectedSection);
	const setProject = useProjectStore((state) => state.setProject);
	const setSections = useProjectStore((state) => state.setSections);

	useEffect(() => {
		setProject(project);
		setSections(sections);
	}, [project, setProject, setSections, sections]);

	return (
		<>
			<ProjectEditorHeader
				hasSection={hasSection}
				setIsDialogOpen={setIsSectionDialogOpen}
			/>

			{/* section dialog */}
			{isSectionDialogOpen && (
				<CreateSectionDialog
					project={project}
					isDialogOpen={isSectionDialogOpen}
					setIsDialogOpen={setIsSectionDialogOpen}
				/>
			)}

			{/* page dialog */}
			{isPageDialogOpen && (
				<CreatePageDialog
					sectionId={selectedSectionId}
					isDialogOpen={isPageDialogOpen}
					setIsDialogOpen={closePageDialog}
				/>
			)}

			{!hasSection && <NoSectionUI setIsDialogOpen={setIsSectionDialogOpen} />}
		</>
	);
}
