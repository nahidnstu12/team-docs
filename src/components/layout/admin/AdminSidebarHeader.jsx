"use client";

import { Shield, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Admin Sidebar Header Component
 * 
 * Header section of the admin sidebar displaying:
 * - Admin panel branding
 * - Visual indicators for admin access
 * - Consistent styling with the main application
 */
export default function AdminSidebarHeader() {
  return (
    <div className="flex items-center space-x-2 px-4 py-3">
      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
        <Crown className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Admin Panel</span>
        <Badge variant="secondary" className="text-xs w-fit">
          <Shield className="h-3 w-3 mr-1" />
          Super Admin
        </Badge>
      </div>
    </div>
  );
}
