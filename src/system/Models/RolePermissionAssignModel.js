import Logger from "@/lib/Logger";
import { BaseModel } from "./BaseModel";

export class RolePermissionAssignModel extends BaseModel {
	static modelName = "rolePermissionAssignment";

	static async findByRoleId(roleId) {
		try {
			return await super.findMany({
				where: { roleId },
				select: { permissionId: true },
			});
		} catch (error) {
			Logger.error(error.message, `Find by roleid fail`);
		}
	}

	static async upsert({ where, create, update }) {
		try {
			return await super.upsert({ where, create, update });
		} catch (error) {
			Logger.error(error.message, `Upsert failed`);
			throw error;
		}
	}

	static async delete({ roleId, permissionId }) {
		try {
			return await super.delete({
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
