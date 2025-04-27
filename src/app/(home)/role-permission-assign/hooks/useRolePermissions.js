import { useEffect, useRef, useState, useTransition } from "react";
import { getAllPermissions } from "../action/getAllPermissions";

export function useRolePermissions(roleId, isOpen, reset) {
	const [permissions, setPermissions] = useState([]);
	const [permissionsPending, startPermissionsTransition] = useTransition();
	const hasFetchedPermissions = useRef(false);

	useEffect(() => {
		const fetchedPermissions = async () => {
			try {
				const perms = await getAllPermissions(roleId);
				startPermissionsTransition(() => setPermissions(perms));
			} catch (error) {
				console.error("Failed to fetch permissions:", error);
			}
		};

		if (isOpen && !hasFetchedPermissions.current) {
			hasFetchedPermissions.current = true;
			fetchedPermissions();
		}

		if (!isOpen) {
			setPermissions([]);
			reset({ permissions: [] });
			hasFetchedPermissions.current = false;
		}
	}, [roleId, isOpen, reset]);

	// Update form permissions if permissions data changes
	useEffect(() => {
		if (permissions.length) {
			reset({
				permissions: permissions
					.filter((perm) => perm.checked)
					.map((perm) => perm.id),
			});
		}
	}, [permissions, reset]);

	return { permissionsPending, permissions };
}
