import { WorkspaceDTO } from "../DTOs/WorkspaceDto";
import { WorkspaceModel } from "../Models/WorkspaceModel";
import { BaseService } from "./BaseService";
import Logger from "@/lib/Logger";
import { UserModel } from "../Models/UserModel";

export class WorkspaceService extends BaseService {
	constructor() {
		super("workspace");
	}

	static async getWorkspace(id) {
		if (!id) throw new Error("Session is missing user ID");

		const workspace = await WorkspaceModel.findFirst({
			where: { ownerId: id },
		});
		return workspace;
	}

	static async assignWorkspaceToUser(workspaceId, userId) {
		try {
			await UserModel.update({
				where: { id: userId },
				data: { workspaceId },
			});
		} catch (error) {
			Logger.error(error.message, `Assign workspace to user failed`);
		}
	}

	static async getAllWorkspaces() {
		try {
			const workspaces = await WorkspaceModel.findAll();
			return WorkspaceDTO.toCollection(workspaces);
		} catch (error) {
			Logger.error(error.message, `Get all workspaces failed`);
		}
	}

	static async hasWorkspace(id) {
		if (!id) throw new Error("Session is missing user ID");

		try {
			const workspace = await WorkspaceModel.findFirst({
				where: { ownerId: id },
			});

			return workspace;
		} catch (error) {
			Logger.error(error.message, `has workspace fail`);
		}
	}
}
