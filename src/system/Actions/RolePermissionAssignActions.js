"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { RolePermissionAssignSchema } from "@/lib/schemas/RolePermissionAssignSchema";
import { RolePermissionAssignModel } from "../Models/RolePermissionAssignModel";

/**
 * Handles workspace-specific actions
 * @extends BaseAction
 */
class RolePermissionAssignActions extends BaseAction {
	constructor() {
		super(RolePermissionAssignSchema);
		this.rolePermissionAssignModel = new RolePermissionAssignModel();
	}

	async create(formData) {
		const result = await this.execute(formData);
		Logger.info(result);
		if (!result.success) return result;

		try {
			Logger.success(result.data);
			const { roleId, permissions } = result.data;
			const session = await Session.getCurrentUser();

			// ✅ Fetch current assignments from DB
			const existing = await this.rolePermissionAssignModel.findByRoleId(
				roleId
			);
			const existingIds = new Set(existing.map((p) => p.permissionId));
			const newIds = new Set(permissions);

			// ✅ Calculate new to add
			const toAdd = permissions.filter((id) => !existingIds.has(id));
			// ✅ Calculate which to delete
			const toRemove = [...existingIds].filter((id) => !newIds.has(id));

			// ✅ Upsert new permissions
			await Promise.all(
				toAdd.map((permissionId) =>
					this.rolePermissionAssignModel.upsert({
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
					this.rolePermissionAssignModel.delete({
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
			if (error.code) {
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"description",
					"scope",
				]);
			}
			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to assign permission to role"] },
				data: result.data,
			};
		}
	}
}

/**
 * Server action for workspace creation
 * @param {Object} prevState - Previous form state
 * @param {FormData} formData - Form data
 * @returns {Promise<Object>} Action result
 */
export async function assignPermissionsToRole(prevState, formData) {
	const action = new RolePermissionAssignActions();
	return await action.create(formData);
}
