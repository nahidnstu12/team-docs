"use client";

import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import HomeButton from "./components/HomeButton";
import SectionList from "./components/SectionList";
import CreateSectionButton from "./components/CreateSectionButton";

export default function ProjectEditorSidebar() {
    const sections = useProjectStore((state) => state.sections);

    return (
        <Sidebar className="bg-white border-r">
            <SidebarContent className="flex flex-col h-full">
                <div className="px-2 pt-3">
                    <HomeButton />
                </div>

                <div className="px-3">
                    <div className="my-2 border-t border-gray-200" />
                </div>

                <SectionList sections={sections} />

                <CreateSectionButton />
            </SidebarContent>
        </Sidebar>
    );
}