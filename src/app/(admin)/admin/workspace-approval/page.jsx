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
      description:
        "A leading technology company focused on innovative solutions for modern businesses.",
      ownerName: "John Doe",
      ownerEmail: "john.doe@acme.com",
      createdAt: "2024-01-15T10:30:00Z",
      status: "pending",
    },
    {
      id: "2",
      name: "TechStart Inc",
      description: "Startup company developing cutting-edge mobile applications.",
      ownerName: "Jane Smith",
      ownerEmail: "jane.smith@techstart.com",
      createdAt: "2024-01-14T14:20:00Z",
      status: "pending",
    },
    {
      id: "3",
      name: "Creative Agency",
      description:
        "Full-service creative agency specializing in brand development and digital marketing.",
      ownerName: "Mike Johnson",
      ownerEmail: "mike@creativeagency.com",
      createdAt: "2024-01-13T09:15:00Z",
      status: "pending",
    },
  ];

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

      {/* Pending Workspaces List */}
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
            <Card
              key={workspace.id}
              className="border-l-4 border-l-yellow-500 p-8 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-0 pb-6">
                <div className="flex items-start justify-between">
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
                    <CardDescription className="text-base leading-relaxed">
                      {workspace.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {/* Owner Information */}
                <div className="flex items-center gap-6 text-base text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>{workspace.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>•</span>
                    <span>{workspace.ownerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 px-6 py-3 text-base">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve
                  </Button>
                  <Button size="lg" variant="destructive" className="px-6 py-3 text-base">
                    <XCircle className="h-5 w-5 mr-2" />
                    Reject
                  </Button>
                  <Button size="lg" variant="outline" className="px-6 py-3 text-base">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Future Implementation Note */}
      <Card className="border-dashed p-8">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-muted-foreground">Coming Soon</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Full workspace approval functionality will be implemented in the next phase. This
              includes database integration, email notifications, and bulk actions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
