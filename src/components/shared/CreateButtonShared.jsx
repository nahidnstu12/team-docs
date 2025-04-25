"use client";

import { Button } from "@/components/ui/button";

export default function CreateButtonShared({ onClick }) {
	return (
		<>
			<Button onClick={onClick} className="cursor-pointer">
				Create Role
			</Button>
		</>
	);
}
