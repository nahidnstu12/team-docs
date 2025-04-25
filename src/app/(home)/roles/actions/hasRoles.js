"use server";

import { Session } from "@/lib/Session";
import { RoleService } from "@/system/Services/RoleServices";

export async function hasRolesFn() {
	const session = await Session.getCurrentUser();
	const hasRoles = await RoleService.hasRoles(session.id);
	return hasRoles;
}
