import { BaseModel } from "./BaseModel";

/**
 * Handles workspace-specific database operations
 * @extends BaseModel
 */
export class WorkspaceModel extends BaseModel {
	constructor() {
		super("workspace");
	}

	/**
	 * Finds workspace by email
	 * @param {string} email - User email
	 * @returns {Promise<Object|null>} Found workspace or null
	 */
	async findByEmail(email) {
		return await this.model.findUnique({ where: { email } });
	}

	// inside WorkspaceModel.js
	// async findBy(whereClause) {
	// 	return await this.prisma.workspace.findFirst({
	// 		where: whereClause,
	// 	});
	// }
}
