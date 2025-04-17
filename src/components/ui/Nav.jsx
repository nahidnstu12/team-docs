import Link from "next/link";
import { Button } from "./button";
import { auth, signOut } from "@/app/auth";

export async function Nav() {
	const session = await auth();
	console.log(session);

	return (
		<nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
			<div className="text-2xl font-bold">YourLogo</div>
			{session ? (
				<div className="flex gap-4 items-center">
					<p className="px-2 py-2 rounded-sm">{session.user.username}</p>
					<form
						action={async () => {
							"use server";
							await signOut();
						}}
					>
						<button
							type="submit"
							className="px-2 py-2 rounded-sm bg-red-400 text-white cursor-pointer"
						>
							Sign Out
						</button>
					</form>
				</div>
			) : (
				<div className="flex gap-4">
					<Button asChild className="text-lg h-12 px-6">
						<Link href="/auth/signin">Sign In</Link>
					</Button>
					{/* <Button asChild className="text-lg h-12 px-6">
						<Link href="/auth/signup">Sign Up</Link>
					</Button> */}
				</div>
			)}
		</nav>
	);
}
