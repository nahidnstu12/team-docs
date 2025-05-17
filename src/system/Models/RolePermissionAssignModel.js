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

	static async delete(roleId, permissionId) {
		try {
			// Step 1: Lookup the unique record first using composite key
			const record = await super.findUnique({
				where: {
					roleId_permissionId: {
						roleId,
						permissionId,
					},
				},
				select: { id: true }, // We just need the ID
			});

			// Step 2: If no record found, throw
			if (!record) {
				throw new Error(
					`RolePermissionAssignment not found for roleId=${roleId}, permissionId=${permissionId}`
				);
			}

			// Step 3: Now call the parent delete method with the actual ID
			return await super.delete(record.id);
		} catch (error) {
			Logger.error(error.message, `Delete failed`);
			throw error;
		}
	}
}
