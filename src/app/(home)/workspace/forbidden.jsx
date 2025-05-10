import Link from "next/link";

export default function Forbidden() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
			<div className="w-full max-w-md bg-card rounded-lg shadow-md p-8">
				<div className="flex flex-col items-center space-y-4">
					<ShieldOffIcon className="h-12 w-12 text-destructive" />
					<h1 className="text-2xl font-bold text-center">Permission Denied</h1>
					<p className="text-muted-foreground text-center">
						You don&apos;t have permission to access this page.
					</p>
					<Link
						href="/"
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						Return Home
					</Link>
				</div>
			</div>
		</div>
	);
}

function ShieldOffIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M19.7 14a6.9 6.9 0 0 0 .3-2V5l-8-3-3.2 1.2" />
			<path d="m2 2 20 20" />
			<path d="M4.7 4.7 4 5v7c0 6 8 10 8 10a20.3 20.3 0 0 0 5.62-4.38" />
		</svg>
	);
}
