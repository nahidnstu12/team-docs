"use client";

import { useState } from "react";
import NoRolesUI from "./NoRolesUI";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const RoleCreateFormLazy = dynamic(
	() => import("@/app/(home)/roles/RoleCreateForm"),
	{
		ssr: false,
		loading: () => (
			<div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
				<div className="relative w-[600px] h-[500px] bg-muted border rounded-lg shadow-lg flex items-center justify-center">
					<Spinner size="medium">Opening drawer...</Spinner>
				</div>
			</div>
		),
	}
);

const RoleListingsLazy = dynamic(
	() => import("@/app/(home)/roles/RoleListings"),
	{
		loading: () => <Spinner size="large">Loading roles...</Spinner>,
	}
);

export default function RoleShell({ hasRoles, roles, hasPermissions }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => setIsOpen(true);

	return (
		<>
			{/* Shared dialog at top */}
			{isOpen && (
				<RoleCreateFormLazy isOpen={isOpen} onOpenChange={setIsOpen} />
			)}

			{/* Conditional content */}
			{hasRoles ? (
				<RoleListingsLazy
					roles={roles}
					onCreateClick={handleOpen}
					hasPermissions={hasPermissions}
				/>
			) : (
				<NoRolesUI onCreateClick={handleOpen} />
			)}
		</>
	);
}
