"use client";

import { useState, useTransition } from "react";
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
import { XCircle, Loader2, AlertTriangle } from "lucide-react";
import { rejectWorkspace } from "@/system/Actions/WorkspaceAction";
import { toast } from "sonner";
import Logger from "@/lib/Logger";
import { useAdminRefresh } from "@/components/layout/admin/AdminRefreshContext";

/**
 * Workspace Rejection Confirmation Dialog
 *
 * Shows a confirmation dialog when admin clicks the reject button.
 * Handles the rejection action with proper loading states and error handling.
 */
export default function WorkspaceRejectionDialog({ workspace, trigger, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { triggerRefresh } = useAdminRefresh();

  const handleReject = () => {
    startTransition(async () => {
      try {
        const result = await rejectWorkspace(workspace.id);

        if (result.success) {
          setIsOpen(false);
          toast.success("Workspace Rejected", result.message);
          // Trigger refresh to update sidebar badge and other admin data
          triggerRefresh();
        } else {
          // Keep error toast for debugging
          toast.error("Rejection Failed", {
            description: result.errors?._form?.[0] || "Failed to reject workspace",
            duration: 5000,
          });
        }
      } catch (error) {
        Logger.error(error.message, "Workspace rejection failed");
        toast.error("Rejection Failed", {
          description: "An unexpected error occurred. Please try again.",
          duration: 5000,
        });
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger button */}
      <div onClick={() => setIsOpen(true)} className="w-full">
        {trigger}
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Reject Workspace
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            Are you sure you want to reject the workspace{" "}
            <span className="font-semibold text-foreground">&quot;{workspace.name}&quot;</span>?
            <span className="text-sm block mt-2">
              This action will mark the workspace as inactive and prevent the owner{" "}
              <span className="font-medium text-foreground">{workspace.owner?.username}</span> from
              accessing it. This action cannot be easily undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject Workspace
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
