"use server";

import { Session } from "@/lib/Session";
import { PermissionServices } from "@/system/Services/PermissionServices";

export async function hasPermissionsFn() {
	const session = await Session.getCurrentUser();
	const hasPermissions = await PermissionServices.hasPermissionResouces(
		session.id
	);
	return hasPermissions;
}
