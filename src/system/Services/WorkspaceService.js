import prisma from "@/lib/prisma";
import { WorkspaceDTO } from "../DTOs/WorkspaceDto";
import { WorkspaceModel } from "../Models/WorkspaceModel";
import { BaseService } from "./BaseService";

/**
 * Handles workspace-specific business logic
 * @extends BaseService
 */
export class WorkspaceService extends BaseService {
	constructor() {
		super("workspace");
		this.model = new WorkspaceModel();
	}

	async assignWorkspaceToUser(workspaceId, userId) {
		try {
			await prisma.user.update({
				where: { id: userId },
				data: { workspaceId },
			});
		} catch (error) {
			console.error("Error assigning workspace to user:", error);
			throw new Error("Failed to assign workspace to user");
		}
	}

	/**
	 * Gets all workspaces with DTO transformation
	 * @returns {Promise<Array>} Array of transformed workspaces
	 */
	async getAllWorkspaces() {
		const workspaces = await this.model.findAll();
		return WorkspaceDTO.toCollection(workspaces);
	}

	/**
	 * Checks if the logged-in user already has a workspace
	 * @param {Object} session - The session object containing user data
	 * @returns {Promise<Boolean>} True if user has a workspace, else false
	 */
	async hasWorkspace(id) {
		if (!id) throw new Error("Session is missing user ID");

		const workspace = await this.model.findFirst({
			ownerId: id,
		});

		return workspace;
	}
}
