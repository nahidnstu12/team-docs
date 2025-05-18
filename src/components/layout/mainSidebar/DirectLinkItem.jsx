// components/layout/mainSidebar/DirectLinkItem.jsx
"use client";

import Link from "next/link";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useActiveSection } from "./ActiveSectionContext";

export default function DirectLinkItem({ href, icon: Icon, label, sectionId }) {
    const { isActive, setActive } = useActiveSection();
    const active = isActive(sectionId);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className={cn(active && "bg-muted font-semibold")}
                    onClick={() => setActive(sectionId)}
                >
                    <Link href={href} className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        <span>{label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}