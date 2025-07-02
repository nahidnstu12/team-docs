import { Session } from "@/lib/Session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Settings, Activity } from "lucide-react";

/**
 * Admin Dashboard Page
 *
 * Main landing page for the admin panel providing:
 * - Overview of system statistics
 * - Quick access to main admin functions
 * - System health indicators
 */
export default async function AdminDashboard() {
  // Ensure user is authenticated (layout handles admin check)
  await Session.requireAuth();
  const user = await Session.getCurrentUser();

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back, {user?.username}. Manage your platform from here.
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Total Users</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold">--</div>
            <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Pending Workspaces</CardTitle>
            <Building className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold">--</div>
            <p className="text-sm text-muted-foreground mt-2">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Active Workspaces</CardTitle>
            <Activity className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold">--</div>
            <p className="text-sm text-muted-foreground mt-2">Currently active</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">System Status</CardTitle>
            <Settings className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-green-600">Healthy</div>
            <p className="text-sm text-muted-foreground mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            <CardDescription className="text-base">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <p className="text-base text-muted-foreground">• Review pending workspace requests</p>
            <p className="text-base text-muted-foreground">• Manage user accounts</p>
            <p className="text-base text-muted-foreground">• System configuration</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
            <CardDescription className="text-base">Latest system events</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-base text-muted-foreground">Activity feed coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
