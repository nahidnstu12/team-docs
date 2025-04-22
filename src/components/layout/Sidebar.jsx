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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import SidebarItem from "../abstracts/SidebarItem";

export default function Sidebar({
	session,
	hasWorkspace = false,
	hasProjects = false,
}) {
	const { isOpen } = useSidebarToggle();

	return (
		<aside
			className={cn(
				"transition-all duration-300 bg-background text-foreground h-full flex flex-col border-r shadow-sm",
				isOpen ? "w-52" : "w-0",
				"relative z-50"
			)}
		>
			{isOpen && (
				<>
					{/* NAVIGATION SECTION */}
					<nav className="flex-1 pt-20 px-4 space-y-1">
						{/* Show Workspace nav only if user doesn't have one */}
						{!hasWorkspace && (
							<SidebarItem
								href="/workspace"
								icon={<LayoutDashboard className="h-4 w-4" />}
								label="Create Workspace"
							/>
						)}

						{/* Show Project nav only if user already has a workspace */}
						{hasWorkspace && (
							<SidebarItem
								href="/projects"
								icon={<Box className="h-4 w-4" />}
								label="Projects"
							/>
						)}

						{hasProjects && (
							<SidebarItem
								href="/roles"
								icon={<ShieldCheck className="h-4 w-4" />}
								label="Role & Permission"
							/>
						)}
					</nav>

					{/* AUTH SECTION */}
					<div className="p-4 border-t bg-muted/40 backdrop-blur-sm">
						{session && (
							<div className="space-y-6">
								{/* User Info */}
								<div className="text-sm flex flex-col gap-1">
									<p className="font-medium flex items-center gap-2">
										<User className="w-4 h-4 text-muted-foreground" />
										{session.username}
									</p>
									<p className="text-muted-foreground truncate flex items-center gap-2">
										<Mail className="w-4 h-4 text-muted-foreground" />
										{session.email}
									</p>
								</div>

								{/* Sign Out Button */}
								<form action={signout}>
									<Button
										type="submit"
										variant="destructive"
										className="w-full flex items-center gap-2 cursor-pointer"
									>
										<LogOut className="w-4 h-4" />
										Sign Out
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
