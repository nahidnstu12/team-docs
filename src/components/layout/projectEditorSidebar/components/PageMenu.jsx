// components/project-editor/sidebar/components/PageMenu.jsx
"use client";

import { Copy, MoreHorizontal, Pencil, Settings, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import ComingSoonWrapper from "@/components/abstracts/ComingSoonWrapper";

export default function PageMenu({ pageId }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction className="absolute -translate-y-1/2 right-2 top-1/2">
                    <MoreHorizontal className="w-4 h-4" />
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="max-w-3">
                <ComingSoonWrapper enabled className="w-full">
                    <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2 text-blue-500" />
                        Duplicate
                    </DropdownMenuItem>
                </ComingSoonWrapper>
                <ComingSoonWrapper enabled className="w-full">
                    <DropdownMenuItem>
                        <Pencil className="w-4 h-4 mr-2 text-green-500" />
                        Update
                    </DropdownMenuItem>
                </ComingSoonWrapper>
                <ComingSoonWrapper enabled className="w-full">
                    <DropdownMenuItem>
                        <Trash className="w-4 h-4 mr-2 text-red-500" />
                        Delete
                    </DropdownMenuItem>
                </ComingSoonWrapper>
                <ComingSoonWrapper enabled className="w-full">
                    <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2 text-yellow-500" />
                        Settings
                    </DropdownMenuItem>
                </ComingSoonWrapper>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}