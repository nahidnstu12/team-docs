export class PermissionDTO {
	static toResponse(permission) {
		return {
			id: permission.id,
			name: permission.name,
			description: permission.description,
			scope: permission.scope,
		};
	}

	static toCollection(permissions) {
		return permissions.map((permission) => this.toResponse(permission));
	}
}
