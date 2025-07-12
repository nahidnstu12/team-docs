"use client";

import { cn } from "@/lib/utils";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import SectionMenu from "./SectionMenu";
import PageList from "./PageList";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronDown, FolderKanban } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Removed useRouter, usePathname, useSearchParams - no longer needed for URL updates

export default function SectionItem({ section, isOpen, onToggle }) {
  const selectedPage = useProjectStore((state) => state.selectedPage);
  const setSelectedSection = useProjectStore((state) => state.setSelectedSection);

  const handleSectionClick = () => {
    onToggle();
    setSelectedSection(section.id);
    // No URL updates needed - state is managed by Zustand store with persistence
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
        <div className="flex gap-2 items-center">
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-300 text-muted-foreground",
              isOpen ? "rotate-0" : "-rotate-90"
            )}
          />
          <FolderKanban className="w-4 h-4" />
          <TooltipProvider delayDuration={600}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate max-w-[160px] text-sm text-gray-800 block cursor-pointer">
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

      <PageList section={section} isOpen={isOpen} selectedPage={selectedPage} />
    </SidebarMenuItem>
  );
}
