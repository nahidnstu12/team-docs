"use server";

import { PermissionServices } from "@/system/Services/PermissionServices";

export async function getProjectPermission(projectName) {
  return PermissionServices.getPermissionForProjectScope(projectName);
}
