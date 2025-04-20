export class WorkspaceDTO {
	/**
	 * Transforms raw database workspace to API-friendly format
	 * @param {Object} workspace - Raw workspace data
	 * @returns {Object} Transformed workspace
	 */
	static toResponse(workspace) {
		return {
			id: workspace.id,
			name: workspace.name,
			slug: workspace.slug,
			description: workspace.description,
			createdAt: workspace.createdAt.toISOString(),
			updatedAt: workspace.updatedAt.toISOString(),
		};
	}

	/**
	 * Transforms multiple workspaces
	 * @param {Array} workspaces - Array of raw workspaces
	 * @returns {Array} Transformed workspaces
	 */
	static toCollection(workspaces) {
		return workspaces.map((workspace) => this.toResponse(workspace));
	}
}
