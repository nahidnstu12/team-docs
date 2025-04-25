"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hook/useSidebarToggle";
import { signout } from "@/lib/actions/auth/signout";

import {
	LayoutDashboard,
	ShieldCheck,
	User,
	LogOut,
	Mail,
	Box,
	House,
	KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import SidebarItem from "../abstracts/SidebarItem";
import { useActionState } from "react";

export default function Sidebar({
	session,
	hasWorkspace = false,
	hasProjects = false,
	hasRoles = false,
}) {
	const { isOpen } = useSidebarToggle();
	const [state, formAction, isPending] = useActionState(signout, {});

	return (
		<aside
			className={cn(
				"transition-all duration-300 bg-background text-foreground h-full flex flex-col border-r shadow-sm",
				isOpen ? "w-60" : "w-0",
				"relative z-50"
			)}
		>
			{isOpen && (
				<>
					{/* NAVIGATION SECTION */}
					<nav className="flex-1 px-4 pt-20 space-y-1">
						<SidebarItem
							href="/home"
							icon={<House className="w-4 h-4" />}
							label="Home"
						/>
						{/* Show Workspace nav only if user doesn't have one */}
						{!hasWorkspace && (
							<SidebarItem
								href="/workspace"
								icon={<LayoutDashboard className="w-4 h-4" />}
								label="Create Workspace"
							/>
						)}

						{/* Show Project nav only if user already has a workspace */}
						{hasWorkspace && (
							<SidebarItem
								href="/projects"
								icon={<Box className="w-4 h-4" />}
								label="Projects"
							/>
						)}

						{hasProjects && (
							<SidebarItem
								href="/roles"
								icon={<ShieldCheck className="w-4 h-4" />}
								label="Role"
							/>
						)}
						{hasProjects && hasRoles && (
							<SidebarItem
								href="/permissions"
								icon={<KeyRound className="w-4 h-4" />}
								label="Permissions"
							/>
						)}
					</nav>

					{/* AUTH SECTION */}
					<div className="p-4 border-t bg-muted/40 backdrop-blur-sm">
						{session && (
							<div className="space-y-6">
								{/* User Info */}
								<div className="flex flex-col gap-1 text-sm">
									<p className="flex items-center gap-2 font-medium">
										<User className="w-4 h-4 text-muted-foreground" />
										{session.username}
									</p>
									<p className="flex items-center gap-2 truncate text-muted-foreground">
										<Mail className="w-4 h-4 text-muted-foreground" />
										{session.email}
									</p>
								</div>

								{/* Sign Out Button */}
								<form action={formAction}>
									<Button
										disabled={isPending}
										type="submit"
										variant="destructive"
										className="flex items-center w-full gap-2 cursor-pointer"
									>
										<LogOut className="w-4 h-4" />
										{isPending ? "Signing out..." : "Sign Out"}
									</Button>
								</form>
							</div>
						)}
					</div>
				</>
			)}
		</aside>
	);
}
