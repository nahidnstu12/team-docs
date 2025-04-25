"use client";

import { useState } from "react";
import PermissionLisitngs from "./PermisssionListings";
import NoPermissionUI from "./NoPermissionUI";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const PermissionCreateFormLazy = dynamic(
	() => import("@/app/(home)/permissions/PermissionCreateForm"),
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

export default function PermissionShell({
	permissions,
	hasPermissionResouces,
}) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => setIsOpen(true);

	return (
		<>
			{/* Shared dialog at top */}
			{isOpen && (
				<PermissionCreateFormLazy isOpen={isOpen} onOpenChange={setIsOpen} />
			)}

			{/* Conditional content */}
			{hasPermissionResouces ? (
				<PermissionLisitngs
					permissions={permissions}
					onCreateClick={handleOpen}
				/>
			) : (
				<NoPermissionUI onCreateClick={handleOpen} />
			)}
		</>
	);
}
