export class RolePermissionAssignDTO {
	static toResponse(permission) {
		return {
			id: permission.id,
			name: permission.name,
		};
	}

	static toCollection(permissions) {
		return permissions.map((permission) => this.toResponse(permission));
	}

	static mapPermissionsWithSelection(allPermissions, selectedPermissions) {
		const selectedIds = new Set(selectedPermissions.map((p) => p.permissionId));
		return allPermissions.map((perm) => ({
			...perm,
			checked: selectedIds.has(perm.id),
		}));
	}
}
