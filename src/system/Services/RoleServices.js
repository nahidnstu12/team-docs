import { BaseService } from "./BaseService";
import { RoleModel } from "../Models/RoleModel";
import { RoleDTO } from "../DTOs/RoleDTO";
import Logger from "@/lib/Logger";

export class RoleService extends BaseService {
	constructor() {
		super("role");
	}

	static async getAllRoles(whereClause) {
		try {
			const roles = await RoleModel.findMany({ where: whereClause });
			return RoleDTO.toCollection(roles);
		} catch (error) {
			Logger.error(error.message, `Get all roles failed`);
		}
	}

	static async hasRoles(id) {
		if (!id) throw new Error("Session is missing user ID");

		try {
			const role = await RoleModel.findFirst({
				ownerId: id,
			});

			return !!role;
		} catch (error) {
			Logger.error(error.message, `has roles fail`);
		}
	}
}
