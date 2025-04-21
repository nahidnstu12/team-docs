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
