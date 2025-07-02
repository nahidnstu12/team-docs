import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Admin Unauthorized Page
 * 
 * Page shown when users try to access admin routes without proper permissions.
 * Provides clear messaging and navigation options.
 */
export default function AdminUnauthorized() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-md text-center border-yellow-200">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl text-yellow-600">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Admin access is restricted to super administrators only. 
            If you believe this is an error, please contact your system administrator.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to User Panel
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/signin">
                Sign In with Different Account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
