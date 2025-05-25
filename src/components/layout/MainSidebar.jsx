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
	Loader2,
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

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import { signout } from "@/lib/auth/signout";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ComingSoonWrapper from "../abstracts/ComingSoonWrapper";

export default function MainSidebar() {
	const pathname = usePathname();
	const { data: session } = useSession();
	const [_, formAction, isPending] = useActionState(signout, {});

	// Helpers
	const isActive = (href) => pathname === href;
	const isParentActive = (paths = []) =>
		paths.some((path) => pathname.startsWith(path));

	const [openSection, setOpenSection] = useState(() => {
		return isParentActive(["/projects"])
			? "projects"
			: isParentActive(["/users", "/roles", "/permissions"])
			? "users"
			: isParentActive(["/settings"])
			? "settings"
			: "";
	});

	const toggleSection = (section) => {
		setOpenSection((prev) => (prev === section ? "" : section));
	};

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

				{/* User Manage */}
				<SidebarCollapseSection
					title="User Manage"
					icon={Users}
					isOpen={openSection === "users"}
					onToggle={() => toggleSection("users")}
				>
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
							className={isActive("/roles") ? "bg-muted font-semibold" : ""}
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
							className={isActive("/users") ? "bg-muted font-semibold" : ""}
						>
							<Link href="/users">
								<Users className="w-4 h-4" />
								<span>Users</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuSubItem>
				</SidebarCollapseSection>

				{/* Project Manage */}
				<SidebarCollapseSection
					title="Project Manage"
					icon={FolderKanban}
					isOpen={openSection === "projects"}
					onToggle={() => toggleSection("projects")}
				>
					<SidebarMenuSubItem>
						<SidebarMenuButton
							asChild
							className={isActive("/projects") ? "bg-muted font-semibold" : ""}
						>
							<Link href="/projects">
								<FolderOpenDot className="w-4 h-4" />
								<span>Projects</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuSubItem>
				</SidebarCollapseSection>

				

				{/* Settings */}
				<SidebarCollapseSection
					title="Settings"
					icon={Settings}
					isOpen={openSection === "settings"}
					onToggle={() => toggleSection("settings")}
				>
					<SidebarMenuSubItem>
						<ComingSoonWrapper enabled className="w-full">
							<SidebarMenuButton
								asChild
								className={
									isActive("/settings/profile") ? "bg-muted font-semibold" : ""
								}
							>
								<Link href="/settings/profile">
									<UserPen className="w-4 h-4" />
									<span>Profile</span>
								</Link>
							</SidebarMenuButton>
						</ComingSoonWrapper>
					</SidebarMenuSubItem>
				</SidebarCollapseSection>
			</SidebarContent>

			{/* Footer */}
			<SidebarFooter className="relative">
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
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}

function SidebarCollapseSection({
	title,
	icon: Icon,
	isOpen,
	onToggle,
	children,
}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem className="mb-2">
				<SidebarMenuButton
					onClick={onToggle}
					className={cn(
						"justify-between transition-colors",
						isOpen && "bg-muted font-semibold"
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

				{/* Animated content */}
				<AnimatePresence initial={false}>
					{isOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="overflow-hidden"
						>
							<SidebarMenuSub className="p-2 mt-2 ml-4 space-y-1 rounded-md bg-muted/20">
								{children}
							</SidebarMenuSub>
						</motion.div>
					)}
				</AnimatePresence>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
