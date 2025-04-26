"use server";
import { Session } from "@/lib/Session";
import { RolePermissionAssignDTO } from "@/system/DTOs/RolePermissionAssignDTO";
import { PermissionServices } from "@/system/Services/PermissionServices";
import { RolePermissionAssignServices } from "@/system/Services/RolePermissionAssignServices";

export async function getAllPermissions(roleId) {
	const session = await Session.getCurrentUser();

	const allPermissions = await PermissionServices.getAllPermissions({
		ownerId: session.id,
	});

	const preSelectPermissions =
		await RolePermissionAssignServices.getSelectedPermissionsForRole({
			roleId,
			ownerId: session.id,
		});

	const finalRolePermissionListings =
		RolePermissionAssignDTO.mapPermissionsWithSelection(
			allPermissions,
			preSelectPermissions
		);
	return finalRolePermissionListings;
}
