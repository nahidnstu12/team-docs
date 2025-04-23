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
	/**
	 * Creates a WorkspaceAction instance
	 * Initializes service and model dependencies
	 */
	constructor() {
		super(RolePermissionAssignSchema);
		this.rolePermissionAssignModel = new RolePermissionAssignModel();
	}

	/**
	 * Creates a new workspace
	 * @param {FormData|Object} formData - Workspace data
	 * @returns {Promise<{
	 *   success: boolean,
	 *   type?: string,
	 *   redirectTo?: string,
	 *   errors?: Object,
	 *   data?: Object
	 * }>} Creation result
	 */
	async create(formData) {
		const result = await this.execute(formData);

		Logger.info(result);
		if (!result.success) return result;

		try {
			const { roleId, permissions } = result.data;
			const session = await Session.getCurrentUser();

			await Promise.all(
				permissions.map((permissionId) =>
					this.rolePermissionAssignModel.create({
						roleId,
						permissionId,
						ownerId: session.id,
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
