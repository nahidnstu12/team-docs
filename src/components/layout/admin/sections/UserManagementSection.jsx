"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Users, UserCheck, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "../ActiveSectionContext";
import { useEffect } from "react";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";

/**
 * User Management Section Component
 *
 * Sidebar section for user-related admin functions including:
 * - All users management
 * - User permissions and roles
 * - Admin user management
 */
export default function UserManagementSection({ sectionId }) {
  const pathname = usePathname();
  const { setActive, isActive } = useActiveSection();

  // Set active section based on current path
  useEffect(() => {
    if (pathname.startsWith("/admin/user")) {
      if (pathname === "/admin/users") {
        setActive(sectionId, "all");
      } else if (pathname === "/admin/user-permissions") {
        setActive(sectionId, "permissions");
      } else if (pathname === "/admin/admin-users") {
        setActive(sectionId, "admins");
      }
    }
  }, [pathname, sectionId, setActive]);

  const menuItems = [
    {
      id: "all",
      title: "All Users",
      icon: Users,
      href: "/admin/users",
      description: "Manage all registered users",
      disabled: true,
    },
    {
      id: "permissions",
      title: "User Permissions",
      icon: UserCheck,
      href: "/admin/user-permissions",
      description: "Manage user roles and permissions",
      disabled: true,
    },
    {
      id: "admins",
      title: "Admin Users",
      icon: Shield,
      href: "/admin/admin-users",
      description: "Manage admin user accounts",
      disabled: true,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-base font-semibold mb-3">
        User Management
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
                  <item.icon className="h-5 w-5 mr-3" />
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
                  <item.icon className="h-5 w-5 mr-3" />
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
