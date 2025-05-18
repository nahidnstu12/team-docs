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

import { deleteProjectAction } from "@/system/Actions/ProjectActions";
import { toast } from "sonner";
import Logger from "@/lib/Logger";

export default function DeleteConfirmationDialog({ project, setStartFetchProjects }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasToastedRef = useRef(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      Logger.debug("Deleting project", { projectId: project.id });

      const result = await deleteProjectAction(null, project.id);

      if (result.success) {
        if (!hasToastedRef.current) {
          toast.success("Project deleted", {
            description: "Project has been successfully deleted.",
          });
          hasToastedRef.current = true;
        }
        setIsOpen(false);
        setStartFetchProjects(true);
        router.refresh();
      } else {
        toast.error("Failed to delete project", {
          description: result.errors?._form?.[0] || "An error occurred while deleting the project.",
        });
      }
    } catch (error) {
      Logger.error(error.message, "Failed to delete project:");
      toast.error("Failed to delete project", {
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
      <Button
        variant="destructive"
        size="sm"
        className="flex gap-1 items-center cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Trash className="w-4 h-4" /> Delete
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              <strong className="mx-1">{project.name}</strong>
              and all associated data.
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
