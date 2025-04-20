"use server";

import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { BaseAction } from "./BaseAction";
import { WorkspaceService } from "../Services/WorkspaceService";
import { WorkspaceModel } from "../Models/WorkspaceModel";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";

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
			const Result = await this.workspaceModel.create(workspaceData);

			console.log("db result from create workspace", Result);

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/workspace",
			};
		} catch (error) {
			console.error("Workspace creation failed:", error);
			// Handle Prisma errors
			if (error.code) {
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"description",
				]);
			}

			return {
				success: false,
				type: "fail",
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
