"use client";

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Settings, Database, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "../ActiveSectionContext";
import { useEffect } from "react";

/**
 * System Settings Section Component
 * 
 * Sidebar section for system-level admin functions including:
 * - General system settings
 * - Database management
 * - Email configuration
 * - Security settings
 */
export default function SystemSettingsSection({ sectionId }) {
  const pathname = usePathname();
  const { setActive, isActive } = useActiveSection();

  // Set active section based on current path
  useEffect(() => {
    if (pathname.startsWith("/admin/settings")) {
      if (pathname === "/admin/settings") {
        setActive(sectionId, "general");
      } else if (pathname === "/admin/settings/database") {
        setActive(sectionId, "database");
      } else if (pathname === "/admin/settings/email") {
        setActive(sectionId, "email");
      } else if (pathname === "/admin/settings/security") {
        setActive(sectionId, "security");
      }
    }
  }, [pathname, sectionId, setActive]);

  const menuItems = [
    {
      id: "general",
      title: "General Settings",
      icon: Settings,
      href: "/admin/settings",
      description: "Configure general system settings",
      disabled: true
    },
    {
      id: "database",
      title: "Database",
      icon: Database,
      href: "/admin/settings/database",
      description: "Database management and monitoring",
      disabled: true
    },
    {
      id: "email",
      title: "Email Settings",
      icon: Mail,
      href: "/admin/settings/email",
      description: "Configure email notifications and SMTP",
      disabled: true
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      href: "/admin/settings/security",
      description: "Security policies and configurations",
      disabled: true
    }
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>System Settings</SidebarGroupLabel>
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
