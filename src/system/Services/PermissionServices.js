import { PermissionDTO } from "../DTOs/PermissionDTO";
import { PermissionModel } from "../Models/PermissionModel";
import { BaseService } from "./BaseService";

/**
 * Handles workspace-specific business logic
 * @extends BaseService
 */
export class PermissionServices extends BaseService {
	constructor() {
		super("permission");
		this.model = new PermissionModel();
	}

	/**
	 * Gets all workspaces with DTO transformation
	 * @returns {Promise<Array>} Array of transformed workspaces
	 */
	async getAllPermissions(whereClause) {
		const permissions = await this.model.findMany(whereClause);
		return PermissionDTO.toCollection(permissions);
	}

	/**
	 * Checks if the logged-in user already has a workspace
	 * @param {Object} session - The session object containing user data
	 * @returns {Promise<Boolean>} True if user has a workspace, else false
	 */
	async hasPermissionResouces(id) {
		if (!id) throw new Error("Session is missing user ID");

		const permissionResources = await this.model.findFirst({
			ownerId: id,
		});

		return !!permissionResources;
	}
}
