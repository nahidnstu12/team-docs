"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { RoleSchema } from "@/lib/schemas/RoleSchema";
import { RoleModel } from "../Models/RoleModel";
import { Session } from "@/lib/Session";
import { revalidatePath } from "next/cache";

class RoleActions extends BaseAction {
	static get schema() {
		return RoleSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const session = await Session.getCurrentUser();

			await RoleModel.create({
				...result.data,
				ownerId: session.id,
			});

			revalidatePath("/roles", "page");
			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/roles",
			};
		} catch (error) {
			Logger.error(error.message, `Role Create fail`);
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"description",
				]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create Role"] },
				data: result.data,
			};
		}
	}
}

export async function createRole(prevState, formData) {
	return await RoleActions.create(formData);
}
