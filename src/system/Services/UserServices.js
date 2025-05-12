import Logger from "@/lib/Logger";
import { BaseService } from "./BaseService";
import { UserModel } from "../Models/UserModel";
import { UserDTO } from "../DTOs/UserDTO";

export class UserServices extends BaseService {
	constructor() {
		super("user");
	}

	static async getUser({ id, email }) {
		if (!id && !email) return false;

		try {
			const user = await UserModel.findFirst({
				OR: [id ? { id } : undefined, email ? { email } : undefined],
			});

			const userDTO = UserDTO.toResponse(user);
			return userDTO;
		} catch (error) {
			Logger.error(error.message, `user fetch fail`);
		}
	}

	static async getAllUsers(workspaceId) {
		if (!workspaceId) throw new Error("workspaceId is missing");

		try {
			return await UserModel.findMany({
				where: { workspaceId },
			});
		} catch (error) {
			Logger.error(error.message, `Get all users failed`);
		}
	}

	static async hasUserResources(ownerId) {
		if (!ownerId) throw new Error("Session is missing user ID");

		try {
			const userResources = await UserModel.findFirst({
				where: { id: ownerId },
			});

			return !!userResources;
		} catch (error) {
			Logger.error(error.message, `has user resource fail`);
		}
	}

	static async getUsersNotInProject(projectId) {
		if (!projectId) throw new Error("projectId is missing");

		try {
			const users = await UserModel.findMany({
				where: {
					NOT: {
						projectPermissions: {
							some: {
								projectId: projectId,
							},
						},
					},
					isSuperAdmin: false,
				},
				select: {
					id: true,
					username: true,
					email: true,
					isActive: true,
					createdAt: true,
					updatedAt: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			Logger.info(
				{ count: users?.length, projectId },
				`Get users not in project`
			);
			return users;
		} catch (error) {
			Logger.error(error.message, `Get user list for project failed`);
		}
	}
}
