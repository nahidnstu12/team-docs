"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import { signout } from "@/lib/auth/signout";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import HomeSection from "./sections/HomeSection";
import WorkspaceSection from "./sections/WorkspaceSection";
import ProjectManageSection from "./sections/ProjectManageSection";
import UserManageSection from "./sections/UserManageSection";
import SettingsSection from "./sections/SettingsSection";
import Footer from "./Footer";
import { ActiveSectionProvider } from "./ActiveSectionContext";

export default function MainSidebar() {
    const pathname = usePathname();

    return (
        <ActiveSectionProvider>
            <Sidebar variant="floating" collapsible="offcanvas">
                <SidebarContent className="px-4 pt-12 flex-1">

                    <HomeSection sectionId="home" />
                    <WorkspaceSection sectionId="workspace" />
                    <ProjectManageSection sectionId="projects" />
                    <UserManageSection sectionId="user" />
                    <SettingsSection sectionId="settings" />
                    <Footer />
                </SidebarContent>
            </Sidebar>
        </ActiveSectionProvider>
    );
}
