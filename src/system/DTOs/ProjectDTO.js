export class ProjectDTO {
	static toResponse(project) {
		return {
			id: project.id,
			name: project.name,
			slug: project.slug,
			description: project?.description || "no description found",
			ownerId: project.ownerId,
			workspaceId: project.workspaceId,
		};
	}

	static toCollection(projects) {
		return projects.map((project) => this.toResponse(project));
	}
}
