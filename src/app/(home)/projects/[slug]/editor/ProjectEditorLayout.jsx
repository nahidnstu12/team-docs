"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import NoSectionUI from "./components/NoSectionUI";
import NoPageSelectedUI from "./components/NoPageSelectedUI";
import RTEeditor from "./components/RTEeditor";
import { useProjectStore } from "../../store/useProjectStore";

export default function ProjectEditorLayout({ hasSection }) {
	const selectedPage = useProjectStore((state) => state.selectedPage);
	const projectName = useProjectStore((state) => state.project?.name);

	return (
		<>
			<ProjectEditorHeader
				selectedPage={selectedPage}
				projectName={projectName}
			/>

			{!hasSection && <NoSectionUI />}
			{hasSection && !selectedPage && <NoPageSelectedUI />}
			{selectedPage && <RTEeditor pageId={selectedPage} />}
		</>
	);
}
