"use client";

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Users, UserCheck, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "../ActiveSectionContext";
import { useEffect } from "react";

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
      disabled: true
    },
    {
      id: "permissions",
      title: "User Permissions",
      icon: UserCheck,
      href: "/admin/user-permissions",
      description: "Manage user roles and permissions",
      disabled: true
    },
    {
      id: "admins",
      title: "Admin Users",
      icon: Shield,
      href: "/admin/admin-users",
      description: "Manage admin user accounts",
      disabled: true
    }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>User Management</SidebarGroupLabel>
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
