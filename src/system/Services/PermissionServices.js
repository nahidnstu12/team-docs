import Logger from "@/lib/Logger";
import { PermissionDTO } from "../DTOs/PermissionDTO";
import { PermissionModel } from "../Models/PermissionModel";
import { BaseService } from "./BaseService";

export class PermissionServices extends BaseService {
  static modelName = "permission";
  static dto = PermissionDTO;

  static async getPermissionForProjectScope(projectName) {
    try {
      const permissions = await PermissionModel.findMany({
        where: {
          scope: projectName,
        },
      });
      return permissions;
    } catch (error) {
      Logger.error(error.message, `Get permission for project scope failed`);
    }
  }

  static async updateResource(id, data) {
    try {
      Logger.debug(`Updating permission with id: ${id}`, data);
      const updatedPermission = await PermissionModel.update({
        where: { id },
        data,
      });

      const permissionDTO = PermissionDTO.toResponse(updatedPermission);
      return permissionDTO;
    } catch (error) {
      Logger.error(error.message, `Permission update fail`);
      throw error;
    }
  }

  static async deleteResource(id) {
    try {
      Logger.debug(`Deleting permission with id: ${id}`);
      await PermissionModel.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      Logger.error(error.message, `Permission delete fail`);
      throw error;
    }
  }
}
