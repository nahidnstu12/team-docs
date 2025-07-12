"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Building,
  FileText,
  Users,
  FolderOpen,
  Clock,
  Eye,
} from "lucide-react";

/**
 * Workspace Details Dialog Component
 *
 * Shows detailed information about a workspace and its owner
 * when the View button is clicked in the workspace approval page.
 */
export default function WorkspaceDetailsDialog({ workspace, trigger }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!workspace) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: "secondary", icon: Clock, label: "Pending" },
      ACTIVE: { variant: "default", icon: Building, label: "Active" },
      INACTIVE: { variant: "destructive", icon: Building, label: "Inactive" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger button */}
      <div onClick={() => setIsOpen(true)} className="w-full">
        {trigger}
      </div>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Eye className="h-6 w-6 text-primary" />
            Workspace Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about the workspace and its owner
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Workspace Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Workspace Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Workspace Name</label>
                <p className="text-base font-medium">{workspace.name}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div>{getStatusBadge(workspace.status)}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Workspace URL</label>
                <p className="text-base font-mono text-primary">{workspace.slug}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{formatDate(workspace.createdAt)}</p>
                </div>
              </div>

              {workspace.description && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-base leading-relaxed">{workspace.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Owner Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Owner Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base font-medium">{workspace.owner?.username}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{workspace.owner?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">{formatDate(workspace.owner?.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <p className="w-fit pl-2">{workspace.owner?.status || "inactive"}</p>
              </div>
            </div>
          </div>

          {/* Workspace Statistics Section */}
          {workspace._count && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Workspace Statistics</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{workspace._count.members || 0}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FolderOpen className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{workspace._count.projects || 0}</p>
                      <p className="text-sm text-muted-foreground">Projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with close button */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
