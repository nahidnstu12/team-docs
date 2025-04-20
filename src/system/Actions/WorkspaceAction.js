"use server";

import { WorkspaceModel } from "../Models/WorkspaceModel";
import { WorkspaceService } from "../Service/WorkspaceService";
import { BaseAction } from "./BaseAction";
import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";

class WorkspaceAction extends BaseAction {
	constructor() {
		super(WorkspaceSchema);
		this.workspaceService = new WorkspaceService();
		this.workspaceModel = new WorkspaceModel();
	}

	async create(formData) {
		const result = await this.execute(formData);

		if (!result.success) {
			return result;
		}

		try {
			const workspaceData = await this.workspaceService.createWorkspace(
				result.data
			);
			await this.workspaceModel.create(workspaceData);

			return {
				...result,
				type: "success",
				redirectTo: "/workspace",
			};
		} catch (error) {
			console.error("Workspace creation failed:", error);
			return {
				success: false,
				errors: { _form: ["Failed to create workspace"] },
				data: result.data,
			};
		}
	}
}

export async function createWorkspace(prevState, formData) {
	const action = new WorkspaceAction();
	return await action.create(formData);
}
