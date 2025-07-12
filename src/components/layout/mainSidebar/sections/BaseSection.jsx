// components/layout/mainSidebar/sections/BaseSection.jsx
"use client";

import { useState } from "react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useActiveSection } from "../ActiveSectionContext";

export default function BaseSection({ title, icon: Icon, sectionId, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const { isActive, setActive } = useActiveSection();

    const handleClick = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setActive("", ""); // Clear active state when closing
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem className="mb-2">
                <SidebarMenuButton
                    onClick={handleClick}
                    className={cn(
                        "justify-between transition-colors",
                        isActive(sectionId) && "bg-muted font-semibold"
                    )}
                >
                    <span className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {title}
                    </span>
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 transition-transform",
                            isOpen ? "rotate-0" : "-rotate-90"
                        )}
                    />
                </SidebarMenuButton>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <SidebarMenuSub
                                className="p-2 mt-2 ml-4 space-y-1 rounded-md bg-muted/20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {children}
                            </SidebarMenuSub>
                        </motion.div>
                    )}
                </AnimatePresence>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}