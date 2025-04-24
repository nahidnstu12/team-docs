"use client";

import { useState } from "react";
import PermissionCreateForm from "./PermissionCreateForm";
import PermissionLisitngs from "./PermisssionListings";
import NoPermissionUI from "./NoPermissionUI";

export default function PermissionShell({
	permissions,
	hasPermissionResouces,
}) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => setIsOpen(true);

	return (
		<>
			{/* Shared dialog at top */}
			<PermissionCreateForm isOpen={isOpen} onOpenChange={setIsOpen} />

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
