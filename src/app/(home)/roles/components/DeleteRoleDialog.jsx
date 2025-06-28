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

import { deleteRoleAction } from "@/system/Actions/RoleActions";
import { useToast } from "@/hooks/useToast";
import Logger from "@/lib/Logger";

export default function DeleteRoleDialog({ role, setShouldStartFetchRoles }) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      Logger.debug("Deleting role", { roleId: role.id });

      const result = await deleteRoleAction(null, role.id);

      if (result.success) {
        toast.showDeleteSuccess("Role");
        setIsOpen(false);
        setShouldStartFetchRoles(true);
      } else {
        toast.error(
          "Failed to delete role",
          result.errors?._form?.[0] || "An error occurred while deleting the role."
        );
      }
    } catch (error) {
      Logger.error(error.message, "Failed to delete role:");
      toast.error("Failed to delete role", "An unexpected error occurred.");
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
            <AlertDialogTitle>Are you sure you want to delete this role?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong className="font-medium">{role.name}</strong> role and all associated
              permissions.
              {role.isSystem && (
                <span className="block p-2 mt-2 text-yellow-700 bg-yellow-50 border-l-4 border-yellow-500">
                  Warning: This is a system role. Deleting it may affect system functionality.
                </span>
              )}
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
