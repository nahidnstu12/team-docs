"use client";

import { Button } from "@/components/ui/button";

export default function CreateButtonShared({ onClick, children }) {
	return (
		<>
			<Button onClick={onClick} className="cursor-pointer">
				{children}
			</Button>
		</>
	);
}
