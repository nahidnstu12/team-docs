import { WorkspaceDTO } from "../DTOs/WorkspaceDto";
import { BaseService } from "./BaseService";
import Logger from "@/lib/Logger";
import { UserModel } from "../Models/UserModel";

export class WorkspaceService extends BaseService {
	static modelName = "workspace";
	static dto = WorkspaceDTO;

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
}
