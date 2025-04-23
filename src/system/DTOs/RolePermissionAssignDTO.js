export class RolePermissionAssignDTO {
	/**
	 * Transforms raw database role to API-friendly format
	 * @param {Object} role - Raw role data
	 * @returns {Object} Transformed role
	 */
	static toResponse(permission) {
		return {
			id: permission.id,
			name: permission.name,
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
