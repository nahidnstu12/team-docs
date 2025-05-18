import { FolderKanban, FolderOpenDot } from "lucide-react";
import BaseSection from "./BaseSection";
import { cn } from "@/lib/utils";
import { SidebarMenuSubItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { useActiveSection } from "../ActiveSectionContext";

export default function ProjectManageSection({ sectionId }) {
    const { isActive, setActive } = useActiveSection();
    return (
        <BaseSection title="Project Manage" icon={FolderKanban} sectionId={sectionId}>
            <SidebarMenuSubItem>
                <SidebarMenuButton
                    asChild
                    className={cn(
                        isActive(sectionId) ? "bg-muted font-semibold" : ""
                    )}
                    onClick={() => setActive(sectionId)}
                >
                    <Link href="/projects">
                        <FolderOpenDot className="w-4 h-4" />
                        <span>Projects</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuSubItem>
        </BaseSection>
    );
}
