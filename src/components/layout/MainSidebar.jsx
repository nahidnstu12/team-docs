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
import { cn } from "@/lib/utils";

export default function MainSidebar() {
	const pathname = usePathname();
	const { data: session } = useSession();
	const [_, formAction, isPending] = useActionState(signout, {});

	// Helpers
	const isActive = (href) => pathname === href;
	const isParentActive = (paths = []) =>
		paths.some((path) => pathname.startsWith(path));

	return (
		<Sidebar variant="floating" collapsible="offcanvas">
			<SidebarContent className="px-4 py-12">
				{/* Home */}
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className={isActive("/home") ? "bg-muted font-semibold" : ""}
						>
							<Link href="/home">
								<Home className="w-5 h-5 mr-3" />
								<span>Home</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>

				{/* Workspace */}
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className={isActive("/workspace") ? "bg-muted font-semibold" : ""}
						>
							<Link href="/workspace">
								<Building2 className="w-5 h-5 mr-3" />
								<span>Workspace</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>

				{/* Project Manage */}
				<SidebarMenu>
					<Collapsible
						defaultOpen={isParentActive(["/projects"])}
						className="group/collapsible"
					>
						<SidebarMenuItem className="mb-2">
							<CollapsibleTrigger asChild>
								<SidebarMenuButton
									className={cn(
										"justify-between transition-colors",
										isParentActive(["/projects"]) && "bg-muted font-semibold"
									)}
								>
									<span className="flex items-center gap-2">
										<FolderKanban className="w-5 h-5" />
										Project Manage
									</span>
									<ChevronDown
										className={cn("transition-transform duration-300")}
									/>
								</SidebarMenuButton>
							</CollapsibleTrigger>

							<CollapsibleContent
								className={cn(
									"overflow-hidden transition-all duration-500 ease-in-out",
									"data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-4",
									"data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-4"
								)}
							>
								<SidebarMenuSub className="p-2 mt-2 ml-4 space-y-1 rounded-md bg-muted/20">
									<SidebarMenuSubItem>
										<SidebarMenuButton
											asChild
											className={
												isActive("/projects") ? "bg-muted font-semibold" : ""
											}
										>
											<Link href="/projects">
												<FolderOpenDot className="w-4 h-4" />
												<span>Projects</span>
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
					<Collapsible
						defaultOpen={isParentActive(["/users", "/roles", "/permissions"])}
						className="group/collapsible"
					>
						<SidebarMenuItem className="mb-2">
							<CollapsibleTrigger asChild>
								<SidebarMenuButton
									className={cn(
										"justify-between transition-colors",
										isParentActive(["/users", "/roles", "/permissions"]) &&
											"bg-muted font-semibold"
									)}
								>
									<span className="flex items-center gap-2">
										<Users className="w-5 h-5" />
										User Manage
									</span>
									<ChevronDown
										className={cn("transition-transform duration-300")}
									/>
								</SidebarMenuButton>
							</CollapsibleTrigger>

							<CollapsibleContent
								className={cn(
									"overflow-hidden transition-all duration-500 ease-in-out",
									"data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-4",
									"data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-4"
								)}
							>
								<SidebarMenuSub className="p-2 mt-2 ml-4 space-y-1 rounded-md bg-muted/20">
									<SidebarMenuSubItem>
										<SidebarMenuButton
											asChild
											className={
												isActive("/permissions") ? "bg-muted font-semibold" : ""
											}
										>
											<Link href="/permissions">
												<Shield className="w-4 h-4" />
												<span>Permissions</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuButton
											asChild
											className={
												isActive("/roles") ? "bg-muted font-semibold" : ""
											}
										>
											<Link href="/roles">
												<SquarePen className="w-4 h-4" />
												<span>Roles</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<SidebarMenuButton
											asChild
											className={
												isActive("/users") ? "bg-muted font-semibold" : ""
											}
										>
											<Link href="/users">
												<Users className="w-4 h-4" />
												<span>Users</span>
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
					<Collapsible
						defaultOpen={isParentActive(["/settings"])}
						className="group/collapsible"
					>
						<SidebarMenuItem className="mb-2">
							<CollapsibleTrigger asChild>
								<SidebarMenuButton
									className={cn(
										"justify-between transition-colors",
										isParentActive(["/settings"]) && "bg-muted font-semibold"
									)}
								>
									<span className="flex items-center gap-2">
										<Settings className="w-5 h-5" />
										Settings
									</span>
									<ChevronDown
										className={cn("transition-transform duration-300")}
									/>
								</SidebarMenuButton>
							</CollapsibleTrigger>

							<CollapsibleContent
								className={cn(
									"overflow-hidden transition-all duration-500 ease-in-out",
									"data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-4",
									"data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-4"
								)}
							>
								<SidebarMenuSub className="p-2 mt-2 ml-4 space-y-1 rounded-md bg-muted/20">
									<SidebarMenuSubItem>
										<SidebarMenuButton
											asChild
											className={
												isActive("/settings/profile")
													? "bg-muted font-semibold"
													: ""
											}
										>
											<Link href="/settings/profile">
												<UserPen className="w-4 h-4" />
												<span>Profile</span>
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
