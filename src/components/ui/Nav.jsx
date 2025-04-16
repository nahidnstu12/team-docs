import Link from "next/link";
import { Button } from "./button";

export function Nav() {
	return (
		<nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
			<div className="text-2xl font-bold">YourLogo</div>
			<div className="flex gap-4">
				<Button asChild variant="ghost" className="text-lg h-12 px-6">
					<Link href="/auth/signin">Sign In</Link>
				</Button>
				<Button asChild className="text-lg h-12 px-6">
					<Link href="/auth/signup">Sign Up</Link>
				</Button>
			</div>
		</nav>
	);
}
