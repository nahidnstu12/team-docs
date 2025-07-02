"use client";

import { Crown } from "lucide-react";

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
    <div className="flex items-end space-x-4 border-b border-gray-200 py-2">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
        <Crown className="h-6 w-6 text-blue-600" />
      </div>
      <div className="flex items-center justify-center flex-col">
        <span className="text-3xl font-bold">Admin Panel</span>
      </div>
    </div>
  );
}
