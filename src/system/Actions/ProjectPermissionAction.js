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

	static async removeDevFromProject(formData) {
		const result = await ProjectUserPermissionService.removeDevFromProject(formData);

		return {
			data: result.data,
			success: true,
		};
	}

	static async modifyDevPermissions(formData) {
		const result = await ProjectUserPermissionService.modifyDevPermissions(formData);

		return {
			data: result.data,
			success: true,
		};
	}
}

export async function assignDevAction(formData) {
	return ProjectPermissionAction.assignDev(formData);
}

export async function removeDevFromProjectAction(formData) {
	return ProjectPermissionAction.removeDevFromProject(formData);
}

export async function modifyDevPermissionsAction(formData) {
	return ProjectPermissionAction.modifyDevPermissions(formData);
}


