"use server";

import { ProjectUserPermissionService } from "@/system/Services/ProjectUserPermissionService";
import { UserServices } from "@/system/Services/UserServices";

export async function getMembers(workspaceId, projectId) {
  const members = await UserServices.getMembers(workspaceId);

  const permissionAssignedMembers = await ProjectUserPermissionService.getProjectAssignedMembers(
    projectId
  );

  return members.filter(
    (member) => !permissionAssignedMembers.map((m) => m.user.id).includes(member.id)
  );
}

export async function getProjectAssignedMembers(projectId) {
  return ProjectUserPermissionService.getProjectAssignedMembers(projectId);
}
