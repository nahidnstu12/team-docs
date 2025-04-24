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
			const permissions = await PermissionModel.findMany(whereClause);
			return PermissionDTO.toCollection(permissions);
		} catch (error) {
			Logger.error(error.message, `Get all permissions failed`);
		}
	}

	static async hasPermissionResouces(id) {
		if (!id) throw new Error("Session is missing user ID");

		try {
			const permissionResources = await PermissionModel.findFirst({
				ownerId: id,
			});

			return !!permissionResources;
		} catch (error) {
			Logger.error(error.message, `has permission resource fail`);
		}
	}
}
