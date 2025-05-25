"use client";

import { useRef, useState } from "react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Logger from "@/lib/Logger";

export default function DeleteConfirmationDialog({
  itemId,
  itemName,
  onDelete,
  onSuccess,
  title = "Are you sure you want to delete this item?",
  description = "This action cannot be undone. This will permanently delete the item and all associated data.",
  successMessage = "Item deleted successfully",
  errorMessage = "Failed to delete item",
  triggerButton = (
    <Button variant="destructive" size="sm" className="flex gap-1 items-center cursor-pointer">
      <Trash className="w-4 h-4" /> Delete
    </Button>
  ),
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasToastedRef = useRef(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      Logger.debug("Deleting item", { itemId });

      const result = await onDelete(itemId);

      if (result?.success) {
        if (!hasToastedRef.current) {
          toast.success(successMessage, {
            description: `${itemName || "Item"} has been successfully deleted.`,
          });
          hasToastedRef.current = true;
        }
        setIsOpen(false);
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(errorMessage, {
          description: result?.errors?._form?.[0] || "An error occurred while deleting the item.",
        });
      }
    } catch (error) {
      Logger.error(error.message, "Failed to delete item:");
      toast.error(errorMessage, {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
      setTimeout(() => {
        hasToastedRef.current = false;
      }, 500);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{triggerButton}</div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
              {itemName && <strong className="mx-1">{itemName}</strong>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
