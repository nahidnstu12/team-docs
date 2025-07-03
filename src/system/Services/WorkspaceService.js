import { WorkspaceDTO } from "../DTOs/WorkspaceDto";
import { BaseService } from "./BaseService";
import Logger from "@/lib/Logger";
import { UserModel } from "../Models/UserModel";
import { WorkspaceModel } from "../Models/WorkspaceModel";
import { WorkspaceStatus } from "@prisma/client";

export class WorkspaceService extends BaseService {
  static modelName = "workspace";
  static dto = WorkspaceDTO;

  static async assignWorkspaceToUser(workspaceId, userId) {
    try {
      await UserModel.update({
        where: { id: userId },
        data: { workspaceId },
      });
    } catch (error) {
      Logger.error(error.message, `Assign workspace to user failed`);
    }
  }

  static async getWorkspaceStatus(workspaceId) {
    if (!workspaceId) return null;

    try {
      const workspace = await WorkspaceModel.findUnique({
        where: { id: workspaceId },
        select: { status: true },
      });
      return workspace?.status || null;
    } catch (error) {
      console.error("Error fetching workspace status:", error);
      return null;
    }
  }

  /**
   * Get all pending workspaces with owner information for admin approval
   * @returns {Array} Array of pending workspaces with owner details
   */
  static async getPendingWorkspaces() {
    try {
      const pendingWorkspaces = await WorkspaceModel.findMany({
        where: { status: WorkspaceStatus.PENDING },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return this.dto.toCollection(pendingWorkspaces);
    } catch (error) {
      Logger.error(error.message, "Get pending workspaces failed");
      return [];
    }
  }

  /**
   * Get count of pending workspaces for badge display
   * @returns {number} Count of pending workspaces
   */
  static async getPendingWorkspacesCount() {
    try {
      const count = await WorkspaceModel.count({
        where: { status: WorkspaceStatus.PENDING },
      });
      Logger.info(`Found ${count} pending workspaces`, "Get pending workspaces count");
      return count;
    } catch (error) {
      Logger.error(error.message, "Get pending workspaces count failed");
      return 0;
    }
  }

  /**
   * Get detailed workspace information including owner details
   * @param {string} workspaceId - The workspace ID
   * @returns {Object|null} Detailed workspace information or null if not found
   */
  static async getWorkspaceDetails(workspaceId) {
    try {
      const workspace = await WorkspaceModel.findUnique({
        where: { id: workspaceId },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
              status: true,
            },
          },
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      });

      if (!workspace) return null;

      return this.dto.toResponse(workspace);
    } catch (error) {
      Logger.error(error.message, "Get workspace details failed");
      return null;
    }
  }
}
