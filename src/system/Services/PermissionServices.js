import Logger from "@/lib/Logger";
import { PermissionDTO } from "../DTOs/PermissionDTO";
import { PermissionModel } from "../Models/PermissionModel";
import { BaseService } from "./BaseService";

export class PermissionServices extends BaseService {
	constructor() {
		super("permission");
	}

	static async getAllPermissions(whereClause) {
		try {
			const permissions = await PermissionModel.findMany({
				where: whereClause,
			});
			return PermissionDTO.toCollection(permissions);
		} catch (error) {
			Logger.error(error.message, `Get all permissions failed`);
		}
	}

	static async hasPermissionResouces(ownerId) {
		if (!ownerId) throw new Error("Session is missing user ID");

		try {
			const permissionResources = await PermissionModel.findFirst({
				ownerId,
			});

			return !!permissionResources;
		} catch (error) {
			Logger.error(error.message, `has permission resource fail`);
		}
	}
}
