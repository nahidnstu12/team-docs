"use server";

import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { BaseAction } from "./BaseAction";
import { WorkspaceService } from "../Service/WorkspaceService";
import { WorkspaceModel } from "../Models/WorkspaceModel";

/**
 * Handles workspace-specific actions
 * @extends BaseAction
 */
class WorkspaceAction extends BaseAction {
	/**
	 * Creates a WorkspaceAction instance
	 * Initializes service and model dependencies
	 */
	constructor() {
		super(WorkspaceSchema);
		this.workspaceService = new WorkspaceService();
		this.workspaceModel = new WorkspaceModel();
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

		if (!result.success) {
			return result;
		}

		try {
			const workspaceData = await this.workspaceService.createWorkspace(
				result.data
			);
			await this.workspaceModel.create(workspaceData);

			return {
				...result,
				type: "success",
				redirectTo: "/workspace",
			};
		} catch (error) {
			console.error("Workspace creation failed:", error);
			return {
				success: false,
				errors: { _form: ["Failed to create workspace"] },
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
export async function createWorkspace(prevState, formData) {
	const action = new WorkspaceAction();
	return await action.create(formData);
}
