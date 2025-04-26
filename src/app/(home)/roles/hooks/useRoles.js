import { useState, useEffect, useTransition } from "react";
import { getAllRolesFn } from "../actions/getAllRoles";
import { getAllPermissions } from "../../role-permission-assign/action/getAllPermissions";

export function useRoles(shouldStartFetchRoles, setShouldStartFetchRoles) {
	const [openPermissionAssignDialog, setOpenPermissionAssignDialog] =
		useState(false);
	const [allRoles, setAllRoles] = useState([]);
	const [_, startRolesTransition] = useTransition();
	const [permissions, setPermissions] = useState([]);
	const [permissionsPending, startPermissionsTransition] = useTransition();
	const [showSkeleton, setShowSkeleton] = useState(true);
	const [selectedRoleId, setSelectedRoleId] = useState(null);

	useEffect(() => {
		async function fetchRoles() {
			const roles = await getAllRolesFn();
			startRolesTransition(() => setAllRoles(roles));
			setShowSkeleton(false);
			setShouldStartFetchRoles(false);
		}

		if (shouldStartFetchRoles) {
			fetchRoles();
		}
	}, [shouldStartFetchRoles, setShouldStartFetchRoles]);

	useEffect(() => {
		if (selectedRoleId && permissions.length === 0) {
			async function fetchPerms() {
				const perms = await getAllPermissions(selectedRoleId);
				startPermissionsTransition(() => setPermissions(perms));
			}
			fetchPerms();
		}
	}, [selectedRoleId, permissions.length]);

	return {
		openPermissionAssignDialog,
		setOpenPermissionAssignDialog,
		allRoles,
		permissionsPending,
		permissions,
		// hasPermissions,
		showSkeleton,
		selectedRoleId,
		setSelectedRoleId,
	};
}
