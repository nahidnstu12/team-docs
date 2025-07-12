"use client";

import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronUp, Loader2, LogOut, User2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import { signout } from "@/lib/auth/signout";

export default function Footer() {
    const { data: session } = useSession();
    const [_, formAction, isPending] = useActionState(signout, {});


    return (
        <SidebarFooter className="relative mt-auto pt-4 border-t border-border px-0">
            {isPending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/80 dark:bg-black/30 backdrop-blur-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                        Signing out...
                    </span>
                </div>
            )}
            <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="p-0">
                                <SidebarMenuButton className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-muted">
                                        <User2 className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex flex-col items-start text-left">
                                        <span className="text-sm font-semibold">
                                            {session?.user?.username}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {session?.user?.email}
                                        </span>
                                    </div>
                                    {/* <ChevronUp className="ml-auto" /> */}
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent side="top" className="mb-3 w-52">
                                <form action={formAction}>
                                    <DropdownMenuItem asChild>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="flex items-center w-full gap-2 text-sm text-left focus:outline-none disabled:opacity-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            {isPending ? "Please wait..." : "Sign Out"}
                                        </button>
                                    </DropdownMenuItem>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </div>
        </SidebarFooter>
    );
}
