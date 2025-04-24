import { ProjectModel } from "../Models/ProjectModel";
import { BaseService } from "./BaseService";

export class ProjectService extends BaseService {
	constructor() {
		super("project");
		this.model = new ProjectModel();
	}

	async hasProjects(id) {
		if (!id) return false;

		const projects = await this.model.findFirst({
			workspaceId: id,
		});

		return !!projects;
	}

	// List all projects for a workspace
	async getAllProjets(workspaceId) {
		if (!workspaceId) throw new Error("workspaceId is missing");

		return await this.model.findMany({
			workspaceId,
		});
	}
}
