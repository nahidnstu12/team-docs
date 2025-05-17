"use server";

import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PermissionServices } from "@/system/Services/PermissionServices";

export async function getAllPermissionsFn() {
	const session = await Session.getCurrentUser();

	const permissions = await PermissionServices.getAllResources({
		where: { ownerId: session.id },
	});

	Logger.debug(permissions, "permissions actions");

	return permissions;
}
