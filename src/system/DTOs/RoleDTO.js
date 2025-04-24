export class RoleDTO {
	/**
	 * Transforms raw database role to API-friendly format
	 * @param {Object} role - Raw role data
	 * @returns {Object} Transformed role
	 */
	static toResponse(role) {
		return {
			id: role.id,
			name: role.name,
			description: role.description,
			isSystem: role.isSystem,
		};
	}

	/**
	 * Transforms multiple roles
	 * @param {Array} roles - Array of raw roles
	 * @returns {Array} Transformed roles
	 */
	static toCollection(roles) {
		return roles.map((role) => this.toResponse(role));
	}
}
