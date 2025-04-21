import { Session } from "@/lib/Session";
import { WorkspaceDTO } from "../DTOs/WorkspaceDto";
import { Helpers } from "../Helpers";
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
	/**
	 * Processes workspace data before persistence
	 * @param {Object} data - Raw workspace data
	 * @returns {Promise<Object>} Processed workspace data
	 */
	async createWorkspace(data) {
		return {
			...data,
			slug: Helpers.generateSlug(data.name),
		};
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

		const workspace = await this.model.findBy({
			ownerId: id,
		});

		return !!workspace;
	}
}
