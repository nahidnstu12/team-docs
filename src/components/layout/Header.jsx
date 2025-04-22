"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hook/useSidebarToggle";
import { cn } from "@/lib/utils";

export default function Header() {
	const { toggle, isOpen } = useSidebarToggle();

	return (
		<header className="h-16 border-b px-4 flex items-center justify-between bg-background">
			<div className="flex items-center space-x-2">
				<Button variant="ghost" size="icon" onClick={toggle}>
					<Menu
						className={cn(
							"transition-transform",
							isOpen ? "rotate-90" : "rotate-0"
						)}
					/>
				</Button>
				<h1 className="text-xl font-semibold">Team Docs</h1>
			</div>
		</header>
	);
}
