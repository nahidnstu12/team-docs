import Logger from "@/lib/Logger";
import { ProjectModel } from "../Models/ProjectModel";
import { ProjectUserPermissionModel } from "../Models/ProjectUserPermission";
import { BaseService } from "./BaseService";
import { UserModel } from "../Models/UserModel";

export class ProjectUserPermissionService extends BaseService {
	constructor() {
		super("projectUserPermission");
	}

	static async assignDev(formData) {
		const { selectedPermissions, selectedUsers, projectId } = formData;

		try {
			const project = await ProjectModel.findUnique({
				where: { id: projectId },
			});

			if (!project) throw new Error("Project not found");

			// Create an array of permission assignments for each user
			const permissionAssignments = selectedUsers.flatMap((userId) =>
				selectedPermissions.map((permissionId) => ({
					projectId,
					permissionId,
					userId,
				}))
			);

			// Create all permission assignments in a single transaction
			const result = await ProjectUserPermissionModel.createMany({
				data: permissionAssignments,
				skipDuplicates: true, // Skip if any combination already exists
			});

			Logger.info(
				{
					usersCount: selectedUsers.length,
					permissionsCount: selectedPermissions.length,
					assignmentsCreated: result.count,
				},
				"Dev permissions assigned successfully"
			);

			return result;
		} catch (error) {
			Logger.error(error.message, `Assign dev failed`);
			throw error;
		}
	}

	static async getProjectUsersList(projectId) {
		if (!projectId) throw new Error("projectId is missing");

		try {
			return await UserModel.findMany({
				where: {
					projectPermissions: {
						some: {
							projectId: projectId,
						},
					},
				},
				// include: {
				// 	projectPermissions: {
				// 		where: {
				// 			projectId: projectId,
				// 		},
				// 		include: {
				// 			permission: true,
				// 		},
				// 	},
				// },
				select: {
					id: true,
					username: true,
					email: true,
					isActive: true,
					createdAt: true,
					updatedAt: true,
					projectPermissions: {
						select: {
							permission: {
								select: {
									id: true,
									name: true,
									description: true,
									scope: true,
								},
							},
						},
					},
				},
			});
		} catch (error) {
			Logger.error(error.message, `Get project users list failed`);
			throw error;
		}
	}
}
