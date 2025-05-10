"use server";

import { Session } from "@/lib/Session";
import { PermissionServices } from "@/system/Services/PermissionServices";

export async function getAllPermissionsFn() {
	const session = await Session.getCurrentUser();

	const permissions = await PermissionServices.getAllPermissions({});

	return permissions;
}
