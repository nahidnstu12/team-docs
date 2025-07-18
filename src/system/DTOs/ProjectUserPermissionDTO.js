export class ProjectUserPermissionDTO {
  static toResponse(projectUserPermission) {
    return {
      user: {
        id: projectUserPermission.user.id,
        username: projectUserPermission.user.username,
        email: projectUserPermission.user.email,
      },
      permission: {
        id: projectUserPermission.permission.id,
        name: projectUserPermission.permission.name,
      },
    };
  }

  static toCollection(projectUserPermissions) {
    return projectUserPermissions.map((projectUserPermission) =>
      this.toResponse(projectUserPermission)
    );
  }
}
