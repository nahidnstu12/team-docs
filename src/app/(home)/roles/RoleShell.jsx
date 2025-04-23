"use client";

import { useState } from "react";
import RoleCreateForm from "./RoleCreateForm";
import RoleLisitngs from "./RoleListings";
import NoRolesUI from "./NoRolesUI";

export default function RoleShell({ hasRoles, roles }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);

	return (
		<>
			{/* Shared dialog at top */}
			<RoleCreateForm isOpen={isOpen} onOpenChange={setIsOpen} />

			{/* Conditional content */}
			{hasRoles ? (
				<RoleLisitngs roles={roles} onCreateClick={handleOpen} />
			) : (
				<NoRolesUI onCreateClick={handleOpen} />
			)}
		</>
	);
}
