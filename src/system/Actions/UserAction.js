"use server";

import { BaseAction } from "./BaseAction";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { UserModel } from "../Models/UserModel";

class UserActions extends BaseAction {
	static get schema() {
		return UserSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const session = await Session.getCurrentUser();
			await UserModel.create({
				...result.data,
				ownerId: session.id,
			});

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/users",
			};
		} catch (error) {
			Logger.error(error.message, `User Create fail`);
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, [
					"username",
					"email",
					"password",
				]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create User"] },
				data: result.data,
			};
		}
	}
}

export async function createUser(prevState, formData) {
	return await UserActions.create(formData);
}
