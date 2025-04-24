import { BaseService } from "./BaseService";
import { RoleModel } from "../Models/RoleModel";
import { RoleDTO } from "../DTOs/RoleDTO";

/**
 * Handles workspace-specific business logic
 * @extends BaseService
 */
export class RoleService extends BaseService {
	constructor() {
		super("role");
		this.model = new RoleModel();
	}

	/**
	 * Gets all workspaces with DTO transformation
	 * @returns {Promise<Array>} Array of transformed workspaces
	 */
	async getAllRoles(whereClause) {
		const roles = await this.model.findMany(whereClause);
		return RoleDTO.toCollection(roles);
	}

	/**
	 * Checks if the logged-in user already has a workspace
	 * @param {Object} session - The session object containing user data
	 * @returns {Promise<Boolean>} True if user has a workspace, else false
	 */
	async hasRoles(id) {
		if (!id) throw new Error("Session is missing user ID");

		const role = await this.model.findFirst({
			ownerId: id,
		});

		return !!role;
	}
}
