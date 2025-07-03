import { Session } from "@/lib/Session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, User, Calendar, Eye, Mail } from "lucide-react";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import WorkspaceDetailsDialog from "./components/WorkspaceDetailsDialog";
import WorkspaceApprovalDialog from "./components/WorkspaceApprovalDialog";
import WorkspaceRejectionDialog from "./components/WorkspaceRejectionDialog";
import { revalidatePath } from "next/cache";
import Logger from "@/lib/Logger";

/**
 * Workspace Approval Page
 *
 * Admin page for managing workspace approval requests.
 * Fetches real pending workspaces from database and provides approval/rejection functionality.
 */
export default async function WorkspaceApprovalPage() {
  // Ensure user is authenticated (layout handles admin check)
  await Session.requireAuth();

  // Fetch pending workspaces from database
  const pendingWorkspaces = await WorkspaceService.getPendingWorkspaces();

  // Function to refresh the page data after approval/rejection
  const refreshData = async () => {
    "use server";
    revalidatePath("/admin/workspace-approval");
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Workspace Approval</h1>
          <p className="text-lg text-muted-foreground">
            Review and manage pending workspace requests
          </p>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-2">
          {pendingWorkspaces.length} Pending
        </Badge>
      </div>

      <div className="space-y-6">
        {pendingWorkspaces.length === 0 ? (
          <Card className="p-8">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-2xl font-semibold">All caught up!</h3>
                <p className="text-lg text-muted-foreground">
                  No pending workspace requests at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          pendingWorkspaces.map((workspace) => (
            <Card key={workspace.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-6">
                <div className="w-[95%]">
                  <CardHeader className="p-0 pb-3">
                    <div className="space-y-3">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        {workspace.name}
                        <Badge
                          variant="outline"
                          className="text-yellow-600 border-yellow-600 px-3 py-1 text-sm"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Pending
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed min-h-20">
                        {workspace.description || "No description provided"}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="flex items-center gap-6 text-base text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span>{workspace.owner?.username}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        <span>{workspace.owner?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="w-[10%] flex flex-col items-center justify-center gap-4">
                  {/* Approve Button with Dialog */}
                  <WorkspaceApprovalDialog
                    workspace={workspace}
                    onSuccess={refreshData}
                    trigger={
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 px-6 py-3 text-base w-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        <CheckCircle className="h-5 w-5 mr-1 translate-x-2" />
                        <span className="font-medium pl-2">Approve</span>
                      </Button>
                    }
                  />

                  {/* Reject Button with Dialog */}
                  <WorkspaceRejectionDialog
                    workspace={workspace}
                    onSuccess={refreshData}
                    trigger={
                      <Button
                        size="lg"
                        variant="destructive"
                        className="px-6 py-3 text-base w-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        <XCircle className="h-5 w-5 mr-0 -translate-x-2" />
                        <span className="font-medium">Reject</span>
                      </Button>
                    }
                  />

                  {/* Details Button with Dialog */}
                  <WorkspaceDetailsDialog
                    workspace={workspace}
                    trigger={
                      <Button
                        size="lg"
                        variant="outline"
                        className="px-6 py-3 text-base w-full flex items-center justify-center shadow-md hover:shadow-lg border-2 transition-all duration-200 transform hover:scale-105 bg-white hover:bg-gray-50"
                      >
                        <Eye className="h-5 w-5 mr-0 -translate-x-2" />
                        <span className="font-medium">Details</span>
                      </Button>
                    }
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
