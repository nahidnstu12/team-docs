"use client";

import { useRef, useState } from "react";
import PermissionLisitngs from "./components/PermisssionListings";
import NoPermissionUI from "./components/NoPermissionUI";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const PermissionCreateDrawerLazy = dynamic(
	() => import("@/app/(home)/permissions/components/PermissionCreateDialog"),
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

export default function PermissionShell({ hasPermissionResouces }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const shouldStartFetchPermissions = useRef(
		hasPermissionResouces ? true : false
	);

	return (
		<>
			{isDialogOpen && (
				<PermissionCreateDrawerLazy
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
					shouldStartFetchPermissions={shouldStartFetchPermissions}
				/>
			)}

			{hasPermissionResouces ? (
				<PermissionLisitngs
					// permissions={permissions}
					setIsDialogOpen={setIsDialogOpen}
					shouldStartFetchPermissions={shouldStartFetchPermissions}
				/>
			) : (
				<NoPermissionUI setIsDialogOpen={setIsDialogOpen} />
			)}
		</>
	);
}
