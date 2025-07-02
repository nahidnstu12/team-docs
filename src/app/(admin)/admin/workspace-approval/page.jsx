import { Session } from "@/lib/Session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, User, Calendar } from "lucide-react";

/**
 * Workspace Approval Page
 * 
 * Admin page for managing workspace approval requests.
 * Currently shows dummy content as placeholder for future implementation.
 */
export default async function WorkspaceApprovalPage() {
  // Ensure user is authenticated (layout handles admin check)
  await Session.requireAuth();

  // Dummy data for demonstration
  const pendingWorkspaces = [
    {
      id: "1",
      name: "Acme Corporation",
      description: "A leading technology company focused on innovative solutions for modern businesses.",
      ownerName: "John Doe",
      ownerEmail: "john.doe@acme.com",
      createdAt: "2024-01-15T10:30:00Z",
      status: "pending"
    },
    {
      id: "2", 
      name: "TechStart Inc",
      description: "Startup company developing cutting-edge mobile applications.",
      ownerName: "Jane Smith",
      ownerEmail: "jane.smith@techstart.com",
      createdAt: "2024-01-14T14:20:00Z",
      status: "pending"
    },
    {
      id: "3",
      name: "Creative Agency",
      description: "Full-service creative agency specializing in brand development and digital marketing.",
      ownerName: "Mike Johnson",
      ownerEmail: "mike@creativeagency.com", 
      createdAt: "2024-01-13T09:15:00Z",
      status: "pending"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Approval</h1>
          <p className="text-muted-foreground">
            Review and manage pending workspace requests
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {pendingWorkspaces.length} Pending
        </Badge>
      </div>

      {/* Pending Workspaces List */}
      <div className="space-y-4">
        {pendingWorkspaces.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold">All caught up!</h3>
                <p className="text-muted-foreground">
                  No pending workspace requests at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          pendingWorkspaces.map((workspace) => (
            <Card key={workspace.id} className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {workspace.name}
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {workspace.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Owner Information */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{workspace.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    <span>{workspace.ownerEmail}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Future Implementation Note */}
      <Card className="border-dashed">
        <CardContent className="py-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-muted-foreground">Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              Full workspace approval functionality will be implemented in the next phase.
              This includes database integration, email notifications, and bulk actions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
