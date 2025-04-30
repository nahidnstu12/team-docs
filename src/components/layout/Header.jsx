"use client";

import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
	return (
		<header className="flex items-center justify-between h-16 px-4 border-b bg-background">
			<div className="flex items-center space-x-2">
				<SidebarTrigger />
				<h1 className="text-xl font-semibold">Team Docs</h1>
			</div>
		</header>
	);
}
