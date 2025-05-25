"use server";

import { PermissionServices } from "@/system/Services/PermissionServices";
import { ProjectUserPermissionService } from "@/system/Services/ProjectUserPermissionService";

export async function getProjectPermission(scope) {
	return PermissionServices.getPermissionForProjectScope(scope);
}

export async function getProjectUsers(projectId) {
	return ProjectUserPermissionService.getProjectUsersList(projectId);
}
