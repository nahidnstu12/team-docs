"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";
import { PermissionModel } from "../Models/PermissionModel";

class PermissionActions extends BaseAction {
	static get schema() {
		return PermissionSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const session = await Session.getCurrentUser();
			await PermissionModel.create({
				...result.data,
				ownerId: session.id,
			});

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/permissions",
			};
		} catch (error) {
			Logger.error(error.message, `Permission Create fail`);
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"description",
					"scope",
				]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create Permission"] },
				data: result.data,
			};
		}
	}
}

export async function createPermissions(prevState, formData) {
	return await PermissionActions.create(formData);
}
