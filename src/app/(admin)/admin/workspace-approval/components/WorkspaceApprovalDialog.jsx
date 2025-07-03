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
import { CheckCircle, Loader2 } from "lucide-react";
import { approveWorkspace } from "@/system/Actions/WorkspaceAction";
import { toast } from "sonner";
import Logger from "@/lib/Logger";

/**
 * Workspace Approval Confirmation Dialog
 *
 * Shows a confirmation dialog when admin clicks the approve button.
 * Handles the approval action with proper loading states and error handling.
 */
export default function WorkspaceApprovalDialog({ workspace, trigger, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      try {
        const result = await approveWorkspace(workspace.id);

        if (result.success) {
          toast.success("Workspace Approved", {
            description: result.message,
            duration: 5000,
          });

          setIsOpen(false);

          // Call onSuccess callback to refresh the data
          if (onSuccess) {
            onSuccess();
          }
        } else {
          const errorMessage = result.errors?._form?.[0] || "Failed to approve workspace";
          toast.error("Approval Failed", {
            description: errorMessage,
            duration: 5000,
          });
        }
      } catch (error) {
        Logger.error(error.message, "Workspace approval failed");
        toast.error("Approval Failed", {
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
            <CheckCircle className="h-5 w-5 text-green-600" />
            Approve Workspace
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to approve the workspace{" "}
              <span className="font-semibold text-foreground">&quot;{workspace.name}&quot;</span>?
            </p>
            <p className="text-sm">
              This action will activate the workspace and allow the owner{" "}
              <span className="font-medium text-foreground">{workspace.owner?.username}</span> to
              start using it immediately.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Workspace
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
