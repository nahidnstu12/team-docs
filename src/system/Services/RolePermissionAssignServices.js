import { RolePermissionAssignDTO } from "../DTOs/RolePermissionAssignDTO";
import { PermissionModel } from "../Models/PermissionModel";
import { RolePermissionAssignModel } from "../Models/RolePermissionAssignModel";
import { BaseService } from "./BaseService";

/**
 * Handles workspace-specific business logic
 * @extends BaseService
 */
export class RolePermissionAssignServices extends BaseService {
	constructor() {
		super("permission");
		this.model = new RolePermissionAssignModel();
	}

	/**
	 * Gets all workspaces with DTO transformation
	 * @returns {Promise<Array>} Array of transformed workspaces
	 */
	async getAllPermissions(whereClause) {
		const permissionModel = new PermissionModel();
		const permissions = await permissionModel.findMany(whereClause);
		return RolePermissionAssignDTO.toCollection(permissions);
	}
}
