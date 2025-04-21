"use server";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { BaseAction } from "./BaseAction";
import { ProjectModel } from "../Models/ProjectModel";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import { WorkspaceService } from "../Services/WorkspaceService";

class ProjectAction extends BaseAction {
	constructor() {
		super(ProjectSchema);
		this.projectModel = new ProjectModel();
	}

	async create(formData) {
		const result = await this.execute(formData);

		Logger.info(result, "result");

		if (!result.success) {
			return result;
		}

		try {
			const session = await Session.getCurrentUser();
			const workspaceService = new WorkspaceService();
			const workspace = await workspaceService.hasWorkspace(session.id);

			await this.projectModel.create({
				...result.data,
				workspace: {
					connect: { id: workspace.id },
				},
			});

			return {
				data: result.data,
				success: true,
				type: "success",
				redirectTo: "/projects",
			};
		} catch (error) {
			// Logger.error(error, "project creation failed:");
			// Handle Prisma errors
			if (error.code) {
				return PrismaErrorFormatter.handle(error, result.data, [
					"name",
					"slug",
					"description",
				]);
			}

			return {
				success: false,
				type: "fail",
				errors: { _form: ["Failed to create workspace"] },
				data: result.data,
			};
		}
	}
}

export async function createProjectAction(prevState, formData) {
	const action = new ProjectAction();
	return await action.create(formData);
}
