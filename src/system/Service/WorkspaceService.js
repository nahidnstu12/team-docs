import { BaseService } from "./BaseService";
import slugify from "slugify";

/**
 * Handles workspace-specific business logic
 * @extends BaseService
 */
export class WorkspaceService extends BaseService {
	/**
	 * Processes workspace data before persistence
	 * @param {Object} data - Raw workspace data
	 * @returns {Promise<Object>} Processed workspace data
	 */
	async createWorkspace(data) {
		return {
			...data,
			slug: this.#generateSlug(data.name),
		};
	}

	/**
	 * Generates URL-friendly slug from name
	 * @private
	 * @param {string} name - Workspace name
	 * @returns {string} Generated slug
	 */
	#generateSlug(name) {
		return slugify(name, {
			lower: true,
			strict: true,
			remove: /[*+~.()'"!:@]/g,
		});
	}
}
