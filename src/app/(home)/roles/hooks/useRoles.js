import { useState, useEffect, useTransition, useRef } from "react";
import { getAllRolesFn } from "../actions/getAllRoles";

export function useRoles(shouldStartFetchRoles, setShouldStartFetchRoles) {
	const [openPermissionAssignDialog, setOpenPermissionAssignDialog] =
		useState(false);
	const [allRoles, setAllRoles] = useState([]);
	const [_, startRolesTransition] = useTransition();
	const [showSkeleton, setShowSkeleton] = useState(true);
	// const [selectedRoleId, setSelectedRoleId] = useState(null);
	const selectedRoleId = useRef(null);

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

	return {
		allRoles,
		showSkeleton,
		selectedRoleId,
		openPermissionAssignDialog,
		setOpenPermissionAssignDialog,
	};
}
