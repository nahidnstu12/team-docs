"use server";

import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { BaseAction } from "./BaseAction";
import { WorkspaceModel } from "../Models/WorkspaceModel";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { WorkspaceService } from "../Services/WorkspaceService";

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
		// this.workspaceService = new WorkspaceService();
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

		if (!result.success) return result;

		try {
			const session = await Session.getCurrentUser();

			const createdWorkspace = await this.workspaceModel.create({
				...result.data,
				ownerId: session.id,
			});

			const workspaceService = new WorkspaceService();
			await workspaceService.assignWorkspaceToUser(
				createdWorkspace.id,
				session.id
			);

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/projects",
			};
		} catch (error) {
			Logger.error(error, "Workspace creation failed:");
			// Handle Prisma errors
			if (error.code) {
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"slug",
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
