"use server";

import { PermissionServices } from "@/system/Services/PermissionServices";

export async function getAllPermissionsFn() {
	const permissions = await PermissionServices.getAllResources({});

	return permissions;
}
