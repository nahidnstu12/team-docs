"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import AdminDashboardSection from "./sections/AdminDashboardSection";
import WorkspaceManagementSection from "./sections/WorkspaceManagementSection";
import UserManagementSection from "./sections/UserManagementSection";
import SystemSettingsSection from "./sections/SystemSettingsSection";
import AdminFooter from "./AdminFooter";
import AdminSidebarHeader from "./AdminSidebarHeader";
import { ActiveSectionProvider } from "./ActiveSectionContext";

/**
 * Admin Sidebar Component
 *
 * Main navigation sidebar for admin panel providing:
 * - Dashboard navigation
 * - Workspace management (including approval)
 * - User management
 * - System settings
 * - Admin-specific branding and footer
 *
 * Uses the same patterns as the main sidebar but with admin-specific sections.
 */
export default function AdminSidebar() {
  return (
    <ActiveSectionProvider>
      <Sidebar variant="floating" collapsible="offcanvas">
        <SidebarHeader className="px-6 py-6">
          <AdminSidebarHeader />
        </SidebarHeader>
        <SidebarContent className="px-6 pt-2 flex-1 space-y-6">
          <AdminDashboardSection sectionId="dashboard" />
          <WorkspaceManagementSection sectionId="workspace" />
          <UserManagementSection sectionId="users" />
          <SystemSettingsSection sectionId="settings" />
        </SidebarContent>
        <SidebarFooter className="px-6 py-4">{/* <AdminFooter /> */}</SidebarFooter>
      </Sidebar>
    </ActiveSectionProvider>
  );
}
