"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";
import AdminHeader from "@/components/layout/admin/AdminHeader";
import { Toaster } from "@/components/ui/sonner";

/**
 * Conditional Admin Layout Component
 * 
 * Client-side layout wrapper that provides admin-specific layout structure.
 * This component handles the admin sidebar and header layout for all admin routes.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.defaultOpen - Default sidebar open state
 * @param {Object} props.user - Current user object
 */
export default function ConditionalAdminLayout({ children, defaultOpen, user }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader user={user} />
          <main className="flex-1 overflow-auto bg-background">
            <Toaster position="top-right" richColors />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
