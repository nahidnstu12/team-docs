import { Settings, UserPen } from "lucide-react";
import BaseSection from "./BaseSection";
import { cn } from "@/lib/utils";
import { SidebarMenuSubItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";
import { useActiveSection } from "../ActiveSectionContext";

export default function SettingsSection({ sectionId }) {
    const { isActive, setActive } = useActiveSection();
    return (
        <BaseSection title="Settings" icon={Settings} sectionId={sectionId}>
            <SidebarMenuSubItem>
                <ComingSoonWrapper enabled className="w-full">
                    <SidebarMenuButton
                        asChild
                        className={
                            isActive(sectionId, "profile") ? "bg-muted font-semibold" : ""
                        }
                        onClick={() => setActive(sectionId, "profile")}
                    >
                        <Link href="/settings/profile">
                            <UserPen className="w-4 h-4" />
                            <span>Profile</span>
                        </Link>
                    </SidebarMenuButton>
                </ComingSoonWrapper>
            </SidebarMenuSubItem>
        </BaseSection>
    );
}

