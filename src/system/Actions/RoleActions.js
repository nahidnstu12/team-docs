"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { RoleSchema } from "@/lib/schemas/RoleSchema";
import { RoleModel } from "../Models/RoleModel";
import { Session } from "@/lib/Session";

/**
 * Handles workspace-specific actions
 * @extends BaseAction
 */
class RoleActions extends BaseAction {
	/**
	 * Creates a WorkspaceAction instance
	 * Initializes service and model dependencies
	 */
	constructor() {
		super(RoleSchema);
		this.roleModel = new RoleModel();
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
			await this.roleModel.create({
				...result.data,
				ownerId: session.id,
			});

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/roles",
			};
		} catch (error) {
			Logger.error(error.message, `Role Create fail`);
			if (error.code) {
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"description",
				]);
			}

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create Role"] },
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
export async function createRole(prevState, formData) {
	const action = new RoleActions();
	return await action.create(formData);
}
