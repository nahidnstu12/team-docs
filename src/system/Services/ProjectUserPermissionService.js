import Logger from "@/lib/Logger";
import { ProjectModel } from "../Models/ProjectModel";
import { ProjectUserPermissionModel } from "../Models/ProjectUserPermission";
import { BaseService } from "./BaseService";
import { ProjectUserPermissionDTO } from "../DTOs/ProjectUserPermissionDTO";

export class ProjectUserPermissionService extends BaseService {
  static modelName = "projectUserPermission";
  static dto = ProjectUserPermissionDTO;

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

  /**
   * Remove Dev from assigned permissions table
   * @param {*} formData
   * @returns
   */
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

  /**
   * already assigned members
   * for assign-dev page (left dropdown)
   * @param {*} projectId
   * @returns
   */
  static async getProjectAssignedMembers(projectId) {
    if (!projectId) throw new Error("projectId is missing");

    try {
      return await ProjectUserPermissionModel.findMany({
        where: { projectId },
        select: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      Logger.error(error.message, `Get project users list failed`);
      throw error;
    }
  }

  /**
   * developer listings with permissions in dev-listings table
   * @param {*} projectId
   * @returns
   */
  static async getMembersAndPermissions(projectId) {
    if (!projectId) throw new Error("projectId is missing");

    try {
      const result = await ProjectUserPermissionModel.findMany({
        where: { projectId },
        select: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          permission: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return this.dto.toCollection(result);
    } catch (error) {
      Logger.error(error.message, `Get project users and permissions list failed`);
      throw error;
    }
  }
}
