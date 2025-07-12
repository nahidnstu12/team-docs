"use client";

import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";
import { useSectionDialogStore } from "@/app/(home)/projects/[slug]/editor/store/useSectionDialogStore";

export default function CreateSectionButton() {
  const openSectionDialog = useSectionDialogStore((state) => state.openSectionDialog);

  return (
    <div className="sticky bottom-0 px-2 py-3 mt-auto bg-white border-t">
      <Button
        variant="ghost"
        className="justify-start w-full text-sm text-muted-foreground hover:text-primary hover:bg-gray-100"
        onClick={openSectionDialog}
      >
        <FolderKanban className="mr-2 w-4 h-4 text-gray-500" />
        Create Section
      </Button>
    </div>
  );
}
