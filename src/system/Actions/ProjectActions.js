"use server";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { BaseAction } from "./BaseAction";
import { ProjectModel } from "../Models/ProjectModel";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import { WorkspaceService } from "../Services/WorkspaceService";

class ProjectAction extends BaseAction {
	static get schema() {
		return ProjectSchema;
	}

	static async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) return result;

		try {
			const session = await Session.getCurrentUser();
			const workspace = await WorkspaceService.hasWorkspace(session.id);

			await ProjectModel.create({
				...result.data,
				workspace: {
					connect: { id: workspace.id },
				},
				owner: {
					connect: { id: session.id },
				},
			});

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/projects",
			};
		} catch (error) {
			Logger.error(error.message, "project creation failed:");
			if (error.code)
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"slug",
					"description",
				]);

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create project"] },
				data: result.data,
			};
		}
	}
}

export async function createProjectAction(prevState, formData) {
	return await ProjectAction.create(formData);
}
