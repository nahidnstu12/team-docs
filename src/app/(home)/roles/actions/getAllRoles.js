"use server";

import { Session } from "@/lib/Session";
import { RoleService } from "@/system/Services/RoleServices";

export async function getAllRolesFn() {
	console.log("hit all roles");
	const session = await Session.getCurrentUser();
	const roles = await RoleService.getAllRoles({
		OR: [{ isSystem: true }, { ownerId: session.id }],
	});

	return roles;
}
