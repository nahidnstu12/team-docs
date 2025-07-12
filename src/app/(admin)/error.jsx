"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/**
 * Admin Error Page
 * 
 * Error boundary for admin routes providing:
 * - Admin-specific error handling
 * - Recovery options for admin users
 * - Error reporting and logging
 */
export default function AdminError({ error, reset }) {
  useEffect(() => {
    // Log error for admin monitoring
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-md text-center border-red-200">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">Admin Panel Error</CardTitle>
          <CardDescription>
            Something went wrong in the admin panel. This error has been logged for review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-3 rounded-md text-left">
            <p className="text-sm text-red-800 font-mono">
              {error?.message || "An unexpected error occurred"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={reset} variant="destructive">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild>
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
