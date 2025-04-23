export class PermissionDTO {
	/**
	 * Transforms raw database role to API-friendly format
	 * @param {Object} role - Raw role data
	 * @returns {Object} Transformed role
	 */
	static toResponse(permission) {
		return {
			id: permission.id,
			name: permission.name,
			description: permission.description,
			scope: permission.scope,
		};
	}

	/**
	 * Transforms multiple roles
	 * @param {Array} roles - Array of raw roles
	 * @returns {Array} Transformed roles
	 */
	static toCollection(permissions) {
		return permissions.map((permission) => this.toResponse(permission));
	}
}
