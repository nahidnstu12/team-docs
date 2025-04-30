export class WorkspaceDTO {
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

	static toCollection(workspaces) {
		return workspaces.map((workspace) => this.toResponse(workspace));
	}
}
