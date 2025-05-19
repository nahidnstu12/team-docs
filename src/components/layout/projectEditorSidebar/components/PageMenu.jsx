// components/project-editor/sidebar/components/PageMenu.jsx
"use client";

import { Copy, Loader2, MoreHorizontal, Pencil, Settings, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import Logger from "@/lib/Logger";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";
import { duplicatePageAction } from "@/system/Actions/PageSections";
import { toast } from "sonner";

// Dynamically import the page dialogs
const PageEditDialog = dynamic(() =>
  import("@/app/(home)/projects/[slug]/editor/components/PageEditDialog")
);

const DeletePageDialog = dynamic(() =>
  import("@/app/(home)/projects/[slug]/editor/components/DeletePageDialog")
);

export default function PageMenu({ page }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [duplicatingPageId, setDuplicatingPageId] = useState(null);

  const handleMenuOpenChange = (open) => {
    if (open && page) {
      // Set this page as selected when menu opens
      useProjectStore.getState().setSelectedPage(page.id);
      // Also set the section to maintain consistency
      useProjectStore.getState().setSelectedSection(page.sectionId);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    Logger.debug("Opening edit dialog for page", { pageId: page?.id });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    Logger.debug("Opening delete dialog for page", { pageId: page?.id });
    setIsDeleteDialogOpen(true);
  };

  const handleDuplicateClick = () => {
    setDuplicatingPageId(page.id);
    startTransition(async () => {
      try {
        const result = await duplicatePageAction(null, page.id);
        if (result.success) {
          toast.success("Page duplicate success", {
            description: "Successfully created a copy of your selected page.",
          });

          // The page list will be updated automatically via revalidatePath
        } else {
          toast.error("Page duplicate fail", {
            description: result.errors?._form?.[0] || "Failed to duplicate page",
          });
        }
      } catch (err) {
        console.error("Page duplication error:", err);
        toast.error("Page duplicate fail", {
          description: "An unexpected error occurred",
        });
      } finally {
        setDuplicatingPageId(null);
      }
    });
  };

  return (
    <>
      <DropdownMenu onOpenChange={handleMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction className="absolute right-2 top-1/2 -translate-y-1/2">
            <MoreHorizontal className="w-4 h-4" />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="overflow-hidden transition-all duration-500 ease-in-out"
        >
          <DropdownMenuItem
            onClick={handleDuplicateClick}
            disabled={isPending && duplicatingPageId === page.id}
          >
            {isPending && duplicatingPageId === page.id ? (
              <Loader2 className="mr-2 w-4 h-4 text-blue-500 animate-spin" />
            ) : (
              <Copy className="mr-2 w-4 h-4 text-blue-500" />
            )}
            {isPending && duplicatingPageId === page.id ? "Duplicating..." : "Duplicate"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditClick}>
            <Pencil className="mr-2 w-4 h-4 text-green-500" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteClick}>
            <Trash className="mr-2 w-4 h-4 text-red-500" />
            Delete
          </DropdownMenuItem>
          <ComingSoonWrapper enabled className="w-full">
            <DropdownMenuItem>
              <Settings className="mr-2 w-4 h-4 text-yellow-500" />
              Settings
            </DropdownMenuItem>
          </ComingSoonWrapper>
        </DropdownMenuContent>
      </DropdownMenu>

      <PageEditDialog
        page={page}
        isDialogOpen={isEditDialogOpen}
        setIsDialogOpen={setIsEditDialogOpen}
      />

      <DeletePageDialog
        page={page}
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
