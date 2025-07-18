"use server";

import { PermissionServices } from "@/system/Services/PermissionServices";
import { ProjectUserPermissionService } from "@/system/Services/ProjectUserPermissionService";

export async function getProjectPermission(projectName) {
  return PermissionServices.getPermissionForProjectScope(projectName);
}

export async function getProjectUsers(projectId) {
  return ProjectUserPermissionService.getProjectUsersList(projectId);
}
