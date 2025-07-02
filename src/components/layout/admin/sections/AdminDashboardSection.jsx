"use client";

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "../ActiveSectionContext";
import { useEffect } from "react";

/**
 * Admin Dashboard Section Component
 * 
 * Sidebar section for admin dashboard navigation including:
 * - Main dashboard overview
 * - Analytics and reporting (future)
 * - System monitoring (future)
 */
export default function AdminDashboardSection({ sectionId }) {
  const pathname = usePathname();
  const { setActive, isActive } = useActiveSection();

  // Set active section based on current path
  useEffect(() => {
    if (pathname === "/admin") {
      setActive(sectionId, "dashboard");
    }
  }, [pathname, sectionId, setActive]);

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      description: "Admin overview and statistics"
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      description: "System analytics and reports",
      disabled: true
    }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
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
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
