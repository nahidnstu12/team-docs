"use server";

import { ProjectUserPermissionService } from "@/system/Services/ProjectUserPermissionService";

export async function getMembersPermissionListings(projectId) {
  const result = await ProjectUserPermissionService.getMembersAndPermissions(projectId);

  const userMap = new Map();

  for (const item of result) {
    const { user, permission } = item;

    if (!userMap.has(user.id)) {
      // if the user doesn't exist in map, initialize entry
      userMap.set(user.id, {
        user,
        permissions: [],
      });
    }

    // Push the permission to the existing user's permissions array
    userMap.get(user.id).permissions.push(permission);
  }

  // Convert map values to array
  return Array.from(userMap.values());
}
