"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { useSectionDialogStore } from "@/app/(home)/projects/[slug]/editor/store/useSectionDialogStore";
import SectionMenu from "./SectionMenu";
import PageList from "./PageList";

export default function SectionItem({ section, isOpen, onToggle }) {
    const selectedPage = useProjectStore((state) => state.selectedPage);
    const setSelectedSection = useProjectStore((state) => state.setSelectedSection);
    const setSelectedPage = useProjectStore((state) => state.setSelectedPage);

    const handleSectionClick = () => {
        onToggle();
        setSelectedSection(section.id);
        setSelectedPage(null);
    };

    return (
        <SidebarMenuItem className="relative group">
            <div
                onClick={handleSectionClick}
                className={cn(
                    "flex items-center justify-between w-full p-2 transition rounded-xs hover:bg-gray-200/30",
                    section.pages?.some((p) => p.id === selectedPage) && "bg-blue-100"
                )}
            >
                {/* Section header content */}
                <div className="flex items-center gap-2">
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform duration-300",
                            isOpen ? "rotate-0" : "-rotate-90"
                        )}
                    />
                    <FolderKanban className="w-4 h-4" />
                    <TooltipProvider delayDuration={600}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="truncate max-w-[160px] text-sm text-gray-800 block">
                                    {section.name}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs break-words">
                                {section.name}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <SectionMenu sectionId={section.id} />
            </div>

            <PageList
                section={section}
                isOpen={isOpen}
                selectedPage={selectedPage}
            />
        </SidebarMenuItem>
    );
}