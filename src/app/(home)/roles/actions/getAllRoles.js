"use server";

import { Session } from "@/lib/Session";
import { RoleService } from "@/system/Services/RoleServices";

export async function getAllRolesFn() {
	const session = await Session.getCurrentUser();

	const whereClause = {
		OR: [{ isSystem: true }, { ownerId: session?.id }],
	};

	const roles = await RoleService.getAllResources({ where: whereClause });

	return roles;
}
