"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";
import { PermissionModel } from "../Models/PermissionModel";

/**
 * Handles workspace-specific actions
 * @extends BaseAction
 */
class PermissionActions extends BaseAction {
	/**
	 * Creates a WorkspaceAction instance
	 * Initializes service and model dependencies
	 */
	constructor() {
		super(PermissionSchema);
		this.permissionModel = new PermissionModel();
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

		if (!result.success) return result;

		try {
			const session = await Session.getCurrentUser();
			await this.permissionModel.create({
				...result.data,
				ownerId: session.id,
			});

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/permissions",
			};
		} catch (error) {
			Logger.error(error.message, `Permission Create fail`);
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
				errors: { _form: ["Failed to create Permission"] },
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
export async function createPermissions(prevState, formData) {
	const action = new PermissionActions();
	return await action.create(formData);
}
