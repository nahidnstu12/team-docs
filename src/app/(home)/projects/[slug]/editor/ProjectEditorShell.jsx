"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import { useEffect, useState } from "react";
import NoSectionUI from "./components/NoSectionUI";
import { useProjectStore } from "../../store/useProjectStore";
import { usePageDialogStore } from "../../store/usePageDialogStore";
import dynamic from "next/dynamic";
import DialogLoading from "@/components/laoding/DialogLoading";
import RTEeditor from "./components/RTEeditor";

const CreateSectionDialogLazy = dynamic(
	() =>
		import(
			"@/app/(home)/projects/[slug]/editor/components/CreateSectionDialog"
		),
	{
		ssr: false,
		loading: () => <DialogLoading />,
	}
);
const CreatePageDialogLazy = dynamic(
	() =>
		import("@/app/(home)/projects/[slug]/editor/components/createPageDialog"),
	{
		ssr: false,
		loading: () => <DialogLoading />,
	}
);

export default function ProjectEditorShell({
	hasSection,
	project,
	sections,
	initialContent,
}) {
	const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);

	const isPageDialogOpen = usePageDialogStore(
		(state) => state.isPageDialogOpen
	);
	const closePageDialog = usePageDialogStore((state) => state.closePageDialog);

	const selectedSectionId = useProjectStore((state) => state.selectedSection);
	const setProject = useProjectStore((state) => state.setProject);
	const setSections = useProjectStore((state) => state.setSections);
	const selectedPage = useProjectStore((state) => state.selectedPage);

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
				<CreateSectionDialogLazy
					project={project}
					isDialogOpen={isSectionDialogOpen}
					setIsDialogOpen={setIsSectionDialogOpen}
				/>
			)}

			{/* page dialog */}
			{isPageDialogOpen && (
				<CreatePageDialogLazy
					sectionId={selectedSectionId}
					isDialogOpen={isPageDialogOpen}
					setIsDialogOpen={closePageDialog}
				/>
			)}

			{!hasSection && <NoSectionUI setIsDialogOpen={setIsSectionDialogOpen} />}

			{selectedPage && (
				<RTEeditor pageId={selectedPage} initialContent={initialContent} />
			)}
		</>
	);
}
