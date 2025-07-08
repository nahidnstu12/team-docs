import Logger from "@/lib/Logger";
import { ProjectModel } from "../Models/ProjectModel";
import { ProjectUserPermissionModel } from "../Models/ProjectUserPermission";
import { BaseService } from "./BaseService";
import { UserModel } from "../Models/UserModel";

export class ProjectUserPermissionService extends BaseService {
  constructor() {
    super("projectUserPermission");
  }

  static async assignDev(formData) {
    const { selectedPermissions, selectedUsers, projectId } = formData;

    try {
      const project = await ProjectModel.findUnique({
        where: { id: projectId },
      });

      if (!project) throw new Error("Project not found");

      // Create an array of permission assignments for each user
      const permissionAssignments = selectedUsers.flatMap((userId) =>
        selectedPermissions.map((permissionId) => ({
          projectId,
          permissionId,
          userId,
        }))
      );

      // Create all permission assignments in a single transaction
      const result = await ProjectUserPermissionModel.createMany({
        data: permissionAssignments,
        skipDuplicates: true, // Skip if any combination already exists
      });

      return result;
    } catch (error) {
      Logger.error(error.message, `Assign dev failed`);
      throw error;
    }
  }

  static async removeDevFromProject(formData) {
    const { selectedUser, projectId } = formData;

    try {
      const result = await ProjectUserPermissionModel.deleteMany({
        userId: selectedUser,
        projectId: projectId,
      });

      return result;
    } catch (error) {
      Logger.error(error.message, `Remove dev from project failed`);
      throw error;
    }
  }

  static async modifyDevPermissions({ selectedUser, projectId, selectedPermissions }) {
    try {
      // Step 1: Fetch only needed permissionIds
      const existingPermissionIds = await ProjectUserPermissionModel.findMany({
        where: { userId: selectedUser, projectId },
        select: { permissionId: true },
      }).then((res) => res.map((r) => r.permissionId));

      // Step 2: Determine changes
      const selectedSet = new Set(selectedPermissions);
      const existingSet = new Set(existingPermissionIds);

      const toAdd = selectedPermissions.filter((id) => !existingSet.has(id));
      const toRemove = existingPermissionIds.filter((id) => !selectedSet.has(id));

      // Step 3: Run mutations only if needed
      const operations = [];

      if (toRemove.length > 0) {
        operations.push(
          ProjectUserPermissionModel.deleteMany({
            userId: selectedUser,
            projectId,
            permissionId: { in: toRemove },
          })
        );
      }

      if (toAdd.length > 0) {
        operations.push(
          ProjectUserPermissionModel.createMany({
            data: toAdd.map((permissionId) => ({
              userId: selectedUser,
              projectId,
              permissionId,
            })),
            skipDuplicates: true,
          })
        );
      }

      // Step 4: Execute in parallel
      await Promise.all(operations);

      return { added: toAdd, removed: toRemove };
    } catch (error) {
      Logger.error(error.message, "Modify dev permissions failed");
      throw error;
    }
  }

  static async getProjectUsersList(projectId) {
    if (!projectId) throw new Error("projectId is missing");

    try {
      return await UserModel.findMany({
        where: {
          projectPermissions: {
            some: {
              projectId: projectId,
            },
          },
        },
        // include: {
        // 	projectPermissions: {
        // 		where: {
        // 			projectId: projectId,
        // 		},
        // 		include: {
        // 			permission: true,
        // 		},
        // 	},
        // },
        select: {
          id: true,
          username: true,
          email: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          projectPermissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  scope: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      Logger.error(error.message, `Get project users list failed`);
      throw error;
    }
  }
}
