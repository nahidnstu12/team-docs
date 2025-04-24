import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({ href, icon, label }) {
	const pathname = usePathname();
	const isActive = pathname.startsWith(href);
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-md transition-colors",
				isActive
					? "bg-primary text-primary-foreground"
					: "text-muted-foreground hover:bg-muted"
			)}
		>
			{icon}
			{label}
		</Link>
	);
}
