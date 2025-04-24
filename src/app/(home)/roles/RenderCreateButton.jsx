"use client";

import { Button } from "@/components/ui/button";

export default function RenderCreateButton({ onClick }) {
	return (
		<>
			<Button onClick={onClick} className="cursor-pointer">
				Create Role
			</Button>
			{/* <RoleCreateForm isOpen={isOpen} onOpenChange={onOpenChange} /> */}
		</>
	);
}
