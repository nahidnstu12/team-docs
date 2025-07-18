"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { removeDevFromProjectAction } from "@/system/Actions/ProjectPermissionAction";

export default function DeleteDevDialog({ userId, projectId, onRemoveDevSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const result = await removeDevFromProjectAction({
        selectedUser: userId,
        projectId: projectId,
      });

      if (result.success) {
        toast.success("Developer & Permission deleted", {
          description: "Developer & Permission has been successfully deleted.",
        });
        setIsOpen(false);
        onRemoveDevSuccess();
      } else {
        toast.error("Failed to delete developer & permission", {
          description:
            result.errors?._form?.[0] ||
            "An error occurred while deleting the developer & permission.",
        });
      }
    } catch (error) {
      Logger.error(error.message, "Failed to delete developer & permission:", error);
      toast.error("Failed to delete developer & permission", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
      onRemoveDevSuccess();
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        className="cursor-pointer bg-red-600 hover:text-white-500 hover:bg-red-500 text-white px-5 py-2.5 text-base"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="mr-2 w-5 h-5 text-white" />
        Delete
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this developer & permission?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the developer & permission.
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
