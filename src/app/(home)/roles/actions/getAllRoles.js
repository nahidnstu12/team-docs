"use server";

import { Session } from "@/lib/Session";
import { RoleService } from "@/system/Services/RoleServices";

export async function getAllRolesFn() {
	const session = await Session.getCurrentUser();
	const roles = await RoleService.getAllRoles({
		OR: [{ isSystem: true }, { ownerId: session.id }],
	});

	return roles;
}
