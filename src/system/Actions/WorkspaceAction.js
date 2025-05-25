"use server";

import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { BaseAction } from "./BaseAction";
import { WorkspaceModel } from "../Models/WorkspaceModel";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { WorkspaceService } from "../Services/WorkspaceService";
import { revalidatePath } from "next/cache";

class WorkspaceAction extends BaseAction {
	static get schema() {
		return WorkspaceSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const session = await Session.getCurrentUser();

			const createdWorkspace = await WorkspaceModel.create({
				...result.data,
				ownerId: session.id,
			});

			await WorkspaceService.assignWorkspaceToUser(
				createdWorkspace.id,
				session.id
			);

			revalidatePath("(home)/", "layout");
			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/projects",
			};
		} catch (error) {
			Logger.error(error.message, "Workspace creation failed:");
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"slug",
					"description",
				]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create workspace"] },
				data: result.data,
			};
		}
	}
}

export async function createWorkspace(prevState, formData) {
	return await WorkspaceAction.create(formData);
}
