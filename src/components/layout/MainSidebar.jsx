"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
	Building2,
	ChevronDown,
	ChevronUp,
	FolderKanban,
	FolderOpenDot,
	Home,
	LogOut,
	Settings,
	Shield,
	SquarePen,
	User2,
	UserPen,
	Users,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import { signout } from "@/lib/auth/signout";

export default function MainSidebar() {
	const [_, formAction, isPending] = useActionState(signout, {});
	const { data: session } = useSession();
	const pathname = usePathname();

	console.log(session);

	// Helper to determine if a link is active
	const isActive = (href) => pathname === href;
	return (
		<Sidebar variant="floating" collapsible="offcanvas">
			<SidebarContent className="px-4 py-12">
				{/* Home Link */}
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className={isActive("/home") ? "bg-muted font-semibold" : ""}
							asChild
						>
							<Link href="/home">
								<Home height={35} width={35} className="mr-4" />
								<span>Home</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>

				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className={isActive("/workspace") ? "bg-muted font-semibold" : ""}
							asChild
						>
							<Link href="/workspace">
								<Building2 height={35} width={35} className="mr-4" />
								<span>workspace create</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>

				{/* Project Manage */}
				<SidebarMenu>
					<Collapsible className="group/collapsible">
						<SidebarMenuItem className="mb-2">
							<CollapsibleTrigger asChild>
								<SidebarMenuButton className="justify-between">
									<span className="flex items-center gap-2">
										<FolderKanban height={20} width={20} className="mr-2" />
										Project Manage
									</span>
									<ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
								</SidebarMenuButton>
							</CollapsibleTrigger>

							<CollapsibleContent className="overflow-hidden transition-all data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
								<SidebarMenuSub className="p-2 mt-2 ml-4 space-y-1 rounded-md bg-muted/20">
									<SidebarMenuSubItem>
										<SidebarMenuButton
											className={
												isActive("/projects") ? "bg-muted font-semibold" : ""
											}
											asChild
										>
											<Link href="/projects">
												<FolderOpenDot />
												<span className="">Projects</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				</SidebarMenu>

				{/* User Manage */}
				<SidebarMenu>
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarMenuItem className="mb-2">
							<CollapsibleTrigger asChild>
								<SidebarMenuButton className="justify-between">
									<span className="flex items-center gap-2">
										<Users height={20} width={20} className="mr-2" />
										User Manage
									</span>
									<ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
								</SidebarMenuButton>
							</CollapsibleTrigger>

							<CollapsibleContent className="overflow-hidden transition-all data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
								<SidebarMenuSub className="p-2 mt-2 ml-4 space-y-1 rounded-md bg-muted/20">
									<SidebarMenuSubItem>
										<SidebarMenuButton
											className={
												isActive("/permissions") ? "bg-muted font-semibold" : ""
											}
											asChild
										>
											<Link href="/permissions">
												<Shield />
												<span className="">Permissions</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuButton
											className={
												isActive("/roles") ? "bg-muted font-semibold" : ""
											}
											asChild
										>
											<Link href="/roles">
												<SquarePen />
												<span className="">Roles</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuButton
											className={
												isActive("/users") ? "bg-muted font-semibold" : ""
											}
											asChild
										>
											<Link href="/users">
												<Users />
												Users
												<span className=""></span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				</SidebarMenu>

				{/* Settings */}
				<SidebarMenu>
					<Collapsible className="group/collapsible">
						<SidebarMenuItem className="mb-2">
							<CollapsibleTrigger asChild>
								<SidebarMenuButton className="justify-between">
									<span className="flex items-center gap-2">
										<Settings height={20} width={20} className="mr-2" />
										Settings
									</span>
									<ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
								</SidebarMenuButton>
							</CollapsibleTrigger>

							<CollapsibleContent className="overflow-hidden transition-all data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
								<SidebarMenuSub className="p-2 mt-2 ml-4 space-y-1 rounded-md bg-muted/20">
									<SidebarMenuSubItem>
										<SidebarMenuButton
											className={
												isActive("/settings/profile")
													? "bg-muted font-semibold"
													: ""
											}
											asChild
										>
											<Link href="/settings/profile">
												<UserPen />
												<span className="">Profile</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				</SidebarMenu>
			</SidebarContent>

			{/* Footer */}
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild className="p-0">
								<SidebarMenuButton className="flex items-center gap-2">
									{/* Avatar */}
									<div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-full bg-muted">
										<User2 className="w-4 h-4 text-muted-foreground" />
									</div>
									{/* User Info */}
									<div className="flex flex-col items-start text-left">
										<span className="text-sm font-semibold">
											{session?.user.username}
										</span>
										<span className="text-xs text-muted-foreground">
											{session?.user.email}
										</span>
									</div>
									<ChevronUp className="ml-auto" />
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
			</SidebarFooter>
		</Sidebar>
	);
}
