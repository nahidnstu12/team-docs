"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import { useEffect } from "react";
import NoSectionUI from "./components/NoSectionUI";
import { useProjectStore } from "../../store/useProjectStore";
import { usePageDialogStore } from "../../store/usePageDialogStore";
import dynamic from "next/dynamic";
import DialogLoading from "@/components/loading/DialogLoading";
import RTEeditor from "./components/RTEeditor";
import { useSectionDialogStore } from "./store/useSectionDialogStore";

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

export default function ProjectEditorShell({ hasSection, project, sections }) {
	const isPageDialogOpen = usePageDialogStore(
		(state) => state.isPageDialogOpen
	);
	const closePageDialog = usePageDialogStore((state) => state.closePageDialog);

	const selectedSectionId = useProjectStore((state) => state.selectedSection);
	const setProject = useProjectStore((state) => state.setProject);
	const setSections = useProjectStore((state) => state.setSections);
	const selectedPage = useProjectStore((state) => state.selectedPage);
	const isSectionDialogOpen = useSectionDialogStore(
		(state) => state.isSectionDialogOpen
	);
	const closeSectionDialog = useSectionDialogStore(
		(state) => state.closeSectionDialog
	);
	const openSectionDialog = useSectionDialogStore(
		(state) => state.openSectionDialog
	);

	useEffect(() => {
		setProject(project);
		setSections(sections);
	}, [project, setProject, setSections, sections]);

	return (
		<>
			<ProjectEditorHeader selectedPage={selectedPage} />

			{/* section dialog */}
			{isSectionDialogOpen && (
				<CreateSectionDialogLazy
					project={project}
					isDialogOpen={isSectionDialogOpen}
					setIsDialogOpen={closeSectionDialog}
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

			{!hasSection && <NoSectionUI setIsDialogOpen={openSectionDialog} />}

			{selectedPage && <RTEeditor pageId={selectedPage} />}
		</>
	);
}
