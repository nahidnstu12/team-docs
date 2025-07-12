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
import { useState } from "react";
import dynamic from "next/dynamic";
import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import Logger from "@/lib/Logger";

// Dynamically import the section dialogs
const SectionEditDialog = dynamic(
  () => import("@/app/(home)/projects/[slug]/editor/components/SectionEditDialog")
);

const DeleteSectionDialog = dynamic(
  () => import("@/app/(home)/projects/[slug]/editor/components/DeleteSectionDialog")
);

export default function SectionMenu({ sectionId }) {
  const openPageDialog = usePageDialogStore((state) => state.openPageDialog);
  const sections = useProjectStore((state) => state.sections);
  const section = sections?.find((s) => s.id === sectionId);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = () => {
    Logger.debug("Opening edit dialog for section", { sectionId });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    Logger.debug("Opening delete dialog for section", { sectionId });
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
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
              <DropdownMenuItem onClick={handleEditClick}>
                <Settings className="mr-2 w-4 h-4 text-yellow-500" />
                Update Section
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick}>
                <Trash className="mr-2 w-4 h-4 text-red-500" />
                Delete Section
              </DropdownMenuItem>
            </DropdownMenuContent>
          </motion.div>
        </AnimatePresence>
      </DropdownMenu>

      {section && (
        <>
          <SectionEditDialog 
            section={section}
            isDialogOpen={isEditDialogOpen}
            setIsDialogOpen={setIsEditDialogOpen}
          />
          <DeleteSectionDialog 
            section={section}
            isDialogOpen={isDeleteDialogOpen}
            setIsDialogOpen={setIsDeleteDialogOpen}
          />
        </>
      )}
    </>
  );
}
