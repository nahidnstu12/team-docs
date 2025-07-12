"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "../ActiveSectionContext";
import { useEffect } from "react";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";

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
      description: "Admin overview and statistics",
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      description: "System analytics and reports",
      disabled: true,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-semibold mb-3">Dashboard</SidebarGroupLabel>
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
                className="h-12 text-sm px-2 w-full"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
