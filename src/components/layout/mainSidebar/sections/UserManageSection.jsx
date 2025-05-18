// Example for UserManageSection.jsx
"use client";

import BaseSection from "./BaseSection";
import { SidebarMenuSubItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { useActiveSection } from "../ActiveSectionContext";
import { cn } from "@/lib/utils";

import { Users, Shield, SquarePen } from "lucide-react";

const iconMap = {
    users: Users,
    roles: SquarePen,
    permissions: Shield,
};

export default function UserManageSection({ sectionId }) {
    const { isActive, setActive } = useActiveSection();

    return (
        <BaseSection title="User Management" icon={iconMap.users} sectionId={sectionId}>
            {["users", "roles", "permissions"].map((item, index) => {
                const Icon = iconMap[item];

                return (
                    <SidebarMenuSubItem key={index}>
                        <Link
                            href={`/${item}`}
                            className={cn(
                                "flex items-center gap-2 p-2 text-sm rounded-md hover:bg-muted",
                                isActive(sectionId, item) && "bg-muted font-semibold"
                            )}
                            onClick={() => setActive(sectionId, item)}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="capitalize">{item}</span>
                        </Link>
                    </SidebarMenuSubItem>
                )
            })}
        </BaseSection>
    );
}