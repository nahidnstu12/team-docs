import Logger from "@/lib/Logger";
import { BaseModel } from "./BaseModel";

/**
 * Handles workspace-specific database operations
 * @extends BaseModel
 */
export class RolePermissionAssignModel extends BaseModel {
	constructor() {
		super("rolePermissionAssignment");
	}

	async findByRoleId(roleId) {
		return await this.model.findMany({
			where: { roleId },
			select: { permissionId: true },
		});
	}

	async upsert({ where, create, update }) {
		try {
			return await this.model.upsert({ where, create, update });
		} catch (error) {
			Logger.error(error.message, `Upsert failed`);
			throw error;
		}
	}

	async delete({ roleId, permissionId }) {
		try {
			return await this.model.delete({
				where: {
					roleId_permissionId: { roleId, permissionId },
				},
			});
		} catch (error) {
			Logger.error(error.message, `Delete failed`);
			throw error;
		}
	}
}
