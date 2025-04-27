import { useState, useEffect, useTransition, useRef } from "react";
import { getAllRolesFn } from "../actions/getAllRoles";
import { useStartFetch } from "@/hook/useStartFetch";

export function useRoles(shouldStartFetchRoles, setShouldStartFetchRoles) {
	const [openPermissionAssignDialog, setOpenPermissionAssignDialog] =
		useState(false);
	// const [allRoles, setAllRoles] = useState([]);
	// const [_, startRolesTransition] = useTransition();
	// const [showSkeleton, setShowSkeleton] = useState(true);
	const selectedRoleId = useRef(null);

	const { data, fetchError, showSkeleton } = useStartFetch(
		getAllRolesFn,
		shouldStartFetchRoles,
		setShouldStartFetchRoles
	);

	return {
		data,
		fetchError,
		showSkeleton,
		selectedRoleId,
		openPermissionAssignDialog,
		setOpenPermissionAssignDialog,
	};
}
