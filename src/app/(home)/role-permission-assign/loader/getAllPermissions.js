"use server";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { RolePermissionAssignDTO } from "@/system/DTOs/RolePermissionAssignDTO";
import { PermissionServices } from "@/system/Services/PermissionServices";
import { RolePermissionAssignServices } from "@/system/Services/RolePermissionAssignServices";

export async function getAllPermissions(roleId) {
	const session = await Session.getCurrentUser();
	const permissionServices = new PermissionServices();

	const allPermissions = await permissionServices.getAllPermissions({
		ownerId: session.id,
	});

	const rolePermissionServices = new RolePermissionAssignServices();

	const preSelectPermissions =
		await rolePermissionServices.getSelectedPermissionsForRole({
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
