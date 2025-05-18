"use client";

import { FileText, MoreHorizontal, Settings, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { usePageDialogStore } from "@/app/(home)/projects/store/usePageDialogStore";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";

export default function SectionMenu({ sectionId }) {
  const openPageDialog = usePageDialogStore((state) => state.openPageDialog);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction className="absolute top-2 right-2">
          <MoreHorizontal className="w-4 h-4" />
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <DropdownMenuContent
            side="right"
            align="start"
            className="overflow-hidden transition-all duration-500 ease-in-out"
          >
            <DropdownMenuItem onClick={openPageDialog}>
              <FileText className="mr-2 w-4 h-4 text-blue-500" />
              Create Page
            </DropdownMenuItem>
            <ComingSoonWrapper enabled className="w-full">
              <DropdownMenuItem>
                <Settings className="mr-2 w-4 h-4 text-yellow-500" />
                Update Section
              </DropdownMenuItem>
            </ComingSoonWrapper>
            <ComingSoonWrapper enabled className="w-full">
              <DropdownMenuItem>
                <Trash className="mr-2 w-4 h-4 text-red-500" />
                Delete Section
              </DropdownMenuItem>
            </ComingSoonWrapper>
          </DropdownMenuContent>
        </motion.div>
      </AnimatePresence>
    </DropdownMenu>
  );
}
