"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PageMenu from "./PageMenu";
// Removed useRouter, usePathname, useSearchParams - no longer needed for URL updates

export default function PageItem({ page, isSelected, sectionId, sectionName }) {
  const setSelectedSectionAndPage = useProjectStore((state) => state.setSelectedSectionAndPage);

  const handlePageClick = () => {
    // Use the combined action for better performance
    setSelectedSectionAndPage(sectionId, page.id);
    // No URL updates needed - state is managed by Zustand store with persistence
  };

  return (
    <div className="relative w-full group">
      <a
        href="#"
        onClick={handlePageClick}
        className={cn(
          "flex items-center w-full p-2 rounded-xs transition hover:bg-muted",
          isSelected && "bg-gray-200/40 text-primary font-semibold"
        )}
      >
        <FileText className="w-4 h-4 text-muted-foreground" />
        <TooltipProvider delayDuration={600}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate max-w-[140px] block ml-2 cursor-pointer">
                {page.title || "Untitled Page"}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs break-words">
              {page.title || "Untitled Page"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </a>

      <PageMenu page={page} />
    </div>
  );
}
