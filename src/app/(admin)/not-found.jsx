import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Admin Not Found Page
 * 
 * Custom 404 page for admin routes providing:
 * - Admin-specific styling and branding
 * - Navigation back to admin dashboard
 * - Helpful error message for admin users
 */
export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Admin Page Not Found</CardTitle>
          <CardDescription>
            The admin page you're looking for doesn't exist or hasn't been implemented yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This could be because the feature is still in development or the URL is incorrect.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/home">
                Switch to User Panel
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
