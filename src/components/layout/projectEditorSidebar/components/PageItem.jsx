"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PageMenu from "./PageMenu";

export default function PageItem({ page, isSelected, sectionId }) {
    const setSelectedSection = useProjectStore((state) => state.setSelectedSection);
    const setSelectedPage = useProjectStore((state) => state.setSelectedPage);

    const handlePageClick = () => {
        setSelectedSection(sectionId);
        setSelectedPage(page.id);
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
                            <span className="truncate max-w-[140px] block ml-2">
                                {page.title || "Untitled Page"}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs break-words">
                            {page.title || "Untitled Page"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </a>

            <PageMenu pageId={page.id} />
        </div>
    );
}