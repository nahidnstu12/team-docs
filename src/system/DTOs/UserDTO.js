export class UserDTO {
	static toResponse(user) {
		return {
			id: user.id,
			username: user.username,
			email: user.email,
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString(),
		};
	}

	static toCollection(users) {
		return users.map((user) => this.toResponse(user));
	}
}
