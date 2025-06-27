import { WorkspaceDTO } from "../DTOs/WorkspaceDto";
import { BaseService } from "./BaseService";
import Logger from "@/lib/Logger";
import { UserModel } from "../Models/UserModel";
import { WorkspaceModel } from "../Models/WorkspaceModel";

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
}
