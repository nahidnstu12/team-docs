"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Building, Clock, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "../ActiveSectionContext";
import { useEffect } from "react";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";
import { usePendingWorkspaceCount } from "./hooks/usePendingWorkspaceCount";

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
  const { count: pendingCount, isLoading } = usePendingWorkspaceCount();

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
      badge: isLoading ? "..." : pendingCount > 0 ? pendingCount.toString() : null,
      badgeVariant: "destructive",
    },
    {
      id: "all",
      title: "All Workspaces",
      icon: Building,
      href: "/admin/workspaces",
      description: "Manage all workspaces in the system",
      disabled: true,
    },
    {
      id: "settings",
      title: "Workspace Settings",
      icon: Settings,
      href: "/admin/workspace-settings",
      description: "Configure workspace policies and settings",
      disabled: true,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-semibold mb-3">
        Workspace Management
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.id}>
            {item.disabled ? (
              <ComingSoonWrapper
                enabled
                tooltip={item.description}
                className="h-12 text-sm px-2 w-full"
              >
                <SidebarMenuButton
                  disabled
                  className="h-12 text-sm px-2 w-full flex justify-start items-center"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </ComingSoonWrapper>
            ) : (
              <SidebarMenuButton
                asChild
                isActive={isActive(sectionId, item.id)}
                className="h-12 text-sm px-2 w-full pl-4"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "secondary"}
                      className="ml-auto text-xs px-1 py-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
