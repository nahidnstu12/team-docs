"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteSectionAction } from "@/system/Actions/SectionActions";
import Logger from "@/lib/Logger";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteSectionDialog({ section, isDialogOpen, setIsDialogOpen }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      Logger.debug("Deleting section", { sectionId: section.id });
      const result = await deleteSectionAction(null, section.id);

      if (result.success) {
        toast.success("Section deleted", {
          description: "The section has been successfully deleted.",
        });
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to delete section", {
          description: result.errors?._form?.[0] || "Please try again later",
        });
      }
    } catch (error) {
      Logger.error("Failed to delete section:", error);
      toast.error("An error occurred", {
        description: "Failed to delete section. Please try again later.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!section) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div id="delete-section-dialog-trigger" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-600">Delete Section</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete this section?
          </DialogDescription>
          {section.pages?.length > 0 && (
            <div className="p-3 mt-2 bg-yellow-50 rounded-sm border border-yellow-300">
              <p className="font-medium text-yellow-800">Warning</p>
              <p className="text-sm text-yellow-700">
                This section contains {section.pages.length} page
                {section.pages.length > 1 ? "s" : ""}. Deleting this section will also delete all
                its pages.
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="py-3">
          <div className="p-3 bg-gray-50 rounded-md border">
            <p className="font-medium">{section.name}</p>
            {section.description && (
              <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="mt-2 sm:mt-0">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="mt-2 sm:mt-0"
          >
            {isDeleting ? "Deleting..." : "Delete Section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
