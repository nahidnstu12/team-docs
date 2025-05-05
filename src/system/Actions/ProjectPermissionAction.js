"use server";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { BaseAction } from "./BaseAction";
import { ProjectModel } from "../Models/ProjectModel";
import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { PrismaErrorFormatter } from "@/lib/PrismaErrorFormatter";
import { WorkspaceService } from "../Services/WorkspaceService";
import { ProjectUserPermissionService } from "../Services/ProjectUserPermissionService";

class ProjectPermissionAction extends BaseAction {
	static async assignDev(formData) {
		const result = await ProjectUserPermissionService.assignDev(formData);

		return {
			data: result.data,
			success: true,
			type: "success",
		};
	}
}

export async function assignDevAction(formData) {
	return ProjectPermissionAction.assignDev(formData);
}
