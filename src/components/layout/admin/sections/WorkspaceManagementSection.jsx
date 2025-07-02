"use client";

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Building, CheckCircle, Clock, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "../ActiveSectionContext";
import { useEffect } from "react";

/**
 * Workspace Management Section Component
 * 
 * Sidebar section for workspace-related admin functions including:
 * - Workspace approval (main feature requested)
 * - All workspaces management
 * - Workspace settings and configuration
 */
export default function WorkspaceManagementSection({ sectionId }) {
  const pathname = usePathname();
  const { setActive, isActive } = useActiveSection();

  // Set active section based on current path
  useEffect(() => {
    if (pathname.startsWith("/admin/workspace")) {
      if (pathname === "/admin/workspace-approval") {
        setActive(sectionId, "approval");
      } else if (pathname === "/admin/workspaces") {
        setActive(sectionId, "all");
      } else if (pathname === "/admin/workspace-settings") {
        setActive(sectionId, "settings");
      }
    }
  }, [pathname, sectionId, setActive]);

  const menuItems = [
    {
      id: "approval",
      title: "Workspace Approval",
      icon: Clock,
      href: "/admin/workspace-approval",
      description: "Review and approve pending workspace requests",
      badge: "3", // Dummy count for demonstration
      badgeVariant: "destructive"
    },
    {
      id: "all",
      title: "All Workspaces",
      icon: Building,
      href: "/admin/workspaces",
      description: "Manage all workspaces in the system",
      disabled: true
    },
    {
      id: "settings",
      title: "Workspace Settings",
      icon: Settings,
      href: "/admin/workspace-settings",
      description: "Configure workspace policies and settings",
      disabled: true
    }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace Management</SidebarGroupLabel>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton 
              asChild={!item.disabled}
              isActive={isActive(sectionId, item.id)}
              disabled={item.disabled}
              tooltip={item.description}
            >
              {item.disabled ? (
                <div className="flex items-center">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                </div>
              ) : (
                <Link href={item.href} className="flex items-center">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badgeVariant || "secondary"} 
                      className="ml-auto text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
