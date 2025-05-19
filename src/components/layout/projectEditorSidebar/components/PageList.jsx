// components/project-editor/sidebar/components/PageList.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SidebarMenuSub } from "@/components/ui/sidebar";
import PageItem from "./PageItem";

export default function PageList({ section, isOpen, selectedPage }) {
    if (!section.pages?.length) return null;

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    key="pages"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden ml-4 mt-0.5 bg-gray-200/30"
                >
                    <SidebarMenuSub className="transition-all duration-300 ease-in-out overflow-hidden max-h-[1000px] px-0 mx-0 ml-4 mt-0.5 space-y-1">
                        {section.pages.map((page) => (
                            <PageItem
                                key={page.id}
                                page={page}
                                isSelected={selectedPage === page.id}
                                sectionId={section.id}
                                sectionName={section.name}
                            />
                        ))}
                    </SidebarMenuSub>
                </motion.div>
            )}
        </AnimatePresence>
    );
}