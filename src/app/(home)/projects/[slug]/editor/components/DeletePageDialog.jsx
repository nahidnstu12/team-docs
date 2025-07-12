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
import { deletePageAction } from "@/system/Actions/PageSections";
import Logger from "@/lib/Logger";
import { useState } from "react";
import { toast } from "sonner";

export default function DeletePageDialog({ page, isDialogOpen, setIsDialogOpen }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      Logger.debug("Deleting page", { pageId: page.id });
      const result = await deletePageAction(null, page.id);

      if (result.success) {
        toast.success("Page deleted", {
          description: "The page has been successfully deleted.",
        });
        setIsDeleting(false);
      } else {
        toast.error("Failed to delete page", {
          description: result.errors?._form?.[0] || "Please try again later",
        });
      }
    } catch (error) {
      Logger.error("Failed to delete page:", error);
      toast.error("An error occurred", {
        description: "Failed to delete page. Please try again later.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // const handleOpenChange = async (open) => {
  //   if (!open) {
  //     // Only close the dialog if explicitly closed (cancel or backdrop click)
  //     setIsDialogOpen(false);
  //   }
  // };

  // const handleConfirmDelete = async () => {
  //   const success = await handleDelete();
  //   if (success) {
  //     setIsDialogOpen(false);
  //   }
  // };

  if (!page) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div id="delete-page-dialog-trigger" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-red-600">Delete Page</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete this page? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          <div className="p-3 bg-gray-50 rounded-md border">
            <p className="font-medium">{page.title}</p>
            {page.description && <p className="mt-1 text-sm text-gray-500">{page.description}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isDeleting}
            className="mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="mt-2 sm:mt-0"
          >
            {isDeleting ? "Deleting..." : "Delete Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
