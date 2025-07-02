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
    <div className="space-y-3 border-t border-gray-200 pt-2">
      <Button variant="ghost" size="lg" className="w-full justify-start h-12 text-base" asChild>
        <Link href="/home">
          <Home className="h-5 w-5 mr-3" />
          Back to User Panel
        </Link>
      </Button>
    </div>
  );
}
