"use client";

import { Button } from "@/components/ui/button";
import { Home, HelpCircle } from "lucide-react";
import Link from "next/link";

/**
 * Admin Footer Component
 * 
 * Footer section of the admin sidebar providing:
 * - Quick link back to user panel
 * - Help and support access
 * - Consistent styling with main application footer
 */
export default function AdminFooter() {
  return (
    <div className="px-4 py-3 space-y-2">
      <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
        <Link href="/home">
          <Home className="h-4 w-4 mr-2" />
          Back to User Panel
        </Link>
      </Button>
      
      <Button variant="ghost" size="sm" className="w-full justify-start">
        <HelpCircle className="h-4 w-4 mr-2" />
        Admin Help
      </Button>
      
      <div className="text-xs text-muted-foreground text-center pt-2">
        Admin Panel v1.0
      </div>
    </div>
  );
}
