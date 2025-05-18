"use client";

import ProjectEditorHeader from "@/components/layout/ProjectEditorHeader";
import NoSectionUI from "./components/NoSectionUI";
import RTEeditor from "./components/RTEeditor";
import { useProjectStore } from "../../store/useProjectStore";

export default function ProjectEditorLayout({ project, sections, hasSection }) {
    const selectedPage = useProjectStore((state) => state.selectedPage);
    const projectName = useProjectStore((state) => state.project?.name);

    return (
        <>
            <ProjectEditorHeader
                selectedPage={selectedPage}
                projectName={projectName}
            />

            {!hasSection && <NoSectionUI />}
            {selectedPage && <RTEeditor pageId={selectedPage} />}
        </>
    );
}
