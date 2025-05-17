import Logger from "@/lib/Logger";
import { RolePermissionAssignDTO } from "../DTOs/RolePermissionAssignDTO";
import { PermissionModel } from "../Models/PermissionModel";
import { RolePermissionAssignModel } from "../Models/RolePermissionAssignModel";
import { BaseService } from "./BaseService";

export class RolePermissionAssignServices extends BaseService {
	constructor() {
		super("RolePermissionAssignment");
	}

	static async getAllPermissions(whereClause) {
		try {
			const permissions = await PermissionModel.findMany({
				where: { whereClause },
			});
			return RolePermissionAssignDTO.toCollection(permissions);
		} catch (error) {
			Logger.error(error.message, `Get all permissions failed`);
		}
	}

	static async getSelectedPermissionsForRole({ roleId, ownerId }) {
		try {
			return RolePermissionAssignModel.findMany({
				where: { roleId, ownerId },
				select: { permissionId: true },
			});
		} catch (error) {
			Logger.error(error.message, `Get selected permissions for role failed`);
		}
	}
}
