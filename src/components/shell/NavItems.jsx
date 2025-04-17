import Link from "next/link";

export default function SidebarItem({ href, icon, label }) {
	return (
		<Link
			href={href}
			className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition text-sm font-medium"
		>
			{icon}
			{label}
		</Link>
	);
}

// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { usePathname } from "next/navigation";

// export default function NavItems({ href, label }) {
// 	const pathname = usePathname();
// 	const active = pathname === href;

// 	return (
// 		<Link
// 			href={href}
// 			className={cn(
// 				"block px-4 py-2 rounded-md hover:bg-accent transition",
// 				active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
// 			)}
// 		>
// 			{label}
// 		</Link>
// 	);
// }
