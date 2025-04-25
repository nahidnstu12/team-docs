"use client";

import { useState } from "react";
import NoRolesUI from "./components/NoRolesUI";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const RoleCreateFormLazy = dynamic(
	() => import("@/app/(home)/roles/components/RoleCreateDrawer"),
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
	() => import("@/app/(home)/roles/components/RoleListings"),
	{
		loading: () => <Spinner size="large">Loading roles...</Spinner>,
	}
);

export default function RoleShell({ hasRoles }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [startFetchRoles, setStartFetchRoles] = useState(false);

	return (
		<>
			{isDialogOpen && (
				<RoleCreateFormLazy
					setStartFetchRoles={setStartFetchRoles}
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
				/>
			)}

			{hasRoles ? (
				<RoleListingsLazy
					setIsDialogOpen={setIsDialogOpen}
					startFetchRoles={startFetchRoles}
					setStartFetchRoles={setStartFetchRoles}
				/>
			) : (
				<NoRolesUI setIsDialogOpen={setIsDialogOpen} />
			)}
		</>
	);
}
