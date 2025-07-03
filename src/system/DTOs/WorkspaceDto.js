export class WorkspaceDTO {
  static toResponse(workspace) {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description,
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
      owner: {
        id: workspace.owner.id,
        username: workspace.owner.username,
        email: workspace.owner.email,
        createdAt: workspace.owner.createdAt.toISOString(),
      },
    };
  }

  static toCollection(workspaces) {
    return workspaces.map((workspace) => this.toResponse(workspace));
  }
}
