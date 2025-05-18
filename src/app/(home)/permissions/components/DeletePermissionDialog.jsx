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

import { deletePermissionAction } from "@/system/Actions/PermissionActions";
import { toast } from "sonner";
import Logger from "@/lib/Logger";

export default function DeletePermissionDialog({ permission, setStartFetchPermissions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      Logger.debug("Deleting permission", { permissionId: permission.id });

      const result = await deletePermissionAction(null, permission.id);

      if (result.success) {
        toast.success("Permission deleted", {
          description: "Permission has been successfully deleted.",
        });
        setIsOpen(false);
        setStartFetchPermissions(true);
      } else {
        toast.error("Failed to delete permission", {
          description:
            result.errors?._form?.[0] || "An error occurred while deleting the permission.",
        });
      }
    } catch (error) {
      Logger.error(error.message, "Failed to delete permission:");
      toast.error("Failed to delete permission", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
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
            <AlertDialogTitle>Are you sure you want to delete this permission?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong className="font-medium">&quot;{permission.name}&quot;</strong> permission in
              the <strong className="font-medium">&quot;{permission.scope}&quot;</strong> scope.
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
