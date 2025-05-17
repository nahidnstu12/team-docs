import Logger from "@/lib/Logger";
import { PermissionDTO } from "../DTOs/PermissionDTO";
import { PermissionModel } from "../Models/PermissionModel";
import { BaseService } from "./BaseService";

export class PermissionServices extends BaseService {
	static modelName = "permission";
	static dto = PermissionDTO;

	static async getPermissionForProjectScope(projectScope) {
		try {
			const permissions = await PermissionModel.findMany({
				where: {
					scope: projectScope,
				},
			});
			return permissions;
		} catch (error) {
			Logger.error(error.message, `Get permission for project scope failed`);
		}
	}
}
