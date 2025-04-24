"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { RolePermissionAssignSchema } from "@/lib/schemas/RolePermissionAssignSchema";
import { RolePermissionAssignModel } from "../Models/RolePermissionAssignModel";

class RolePermissionAssignActions extends BaseAction {
	static get schema() {
		return RolePermissionAssignSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const session = await Session.getCurrentUser();
			const { roleId, permissions } = result.data;

			// ✅ Fetch current assignments from DB
			const existing = await RolePermissionAssignModel.findByRoleId(roleId);
			const existingIds = new Set(existing.map((p) => p.permissionId));
			const newIds = new Set(permissions);

			// ✅ Calculate new to add
			const toAdd = permissions.filter((id) => !existingIds.has(id));
			// ✅ Calculate which to delete
			const toRemove = [...existingIds].filter((id) => !newIds.has(id));

			// ✅ Upsert new permissions
			await Promise.all(
				toAdd.map((permissionId) =>
					RolePermissionAssignModel.upsert({
						where: {
							roleId_permissionId: {
								roleId,
								permissionId,
							},
						},
						create: {
							roleId,
							permissionId,
							ownerId: session.id,
						},
						update: {
							ownerId: session.id,
						},
					})
				)
			);

			// ✅ Delete removed permissions
			await Promise.all(
				toRemove.map((permissionId) =>
					RolePermissionAssignModel.delete({
						roleId,
						permissionId,
					})
				)
			);

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/roles",
			};
		} catch (error) {
			Logger.error(error.message, `role permission assignment fail`);
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, ["permissions"]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to assign permission to role"] },
				data: result.data,
			};
		}
	}
}

export async function assignPermissionsToRole(prevState, formData) {
	return await RolePermissionAssignActions.create(formData);
}
