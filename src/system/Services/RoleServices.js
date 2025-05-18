import { BaseService } from "./BaseService";
import { RoleDTO } from "../DTOs/RoleDTO";
import { RoleModel } from "../Models/RoleModel";
import Logger from "@/lib/Logger";

export class RoleService extends BaseService {
  static modelName = "role";
  static dto = RoleDTO;

  static async updateResource(id, data) {
    try {
      Logger.debug(`Updating role with id: ${id}`, data);
      const updatedRole = await RoleModel.update({
        where: { id },
        data,
      });

      const roleDTO = RoleDTO.toResponse(updatedRole);
      return roleDTO;
    } catch (error) {
      Logger.error(error.message, `role update fail`);
      throw error;
    }
  }

  static async deleteResource(id) {
    try {
      Logger.debug(`Deleting role with id: ${id}`);
      await RoleModel.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      Logger.error(error.message, `role delete fail`);
      throw error;
    }
  }
}
