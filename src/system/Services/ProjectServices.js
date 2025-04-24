import Logger from "@/lib/Logger";
import { ProjectModel } from "../Models/ProjectModel";
import { BaseService } from "./BaseService";

export class ProjectService extends BaseService {
	constructor() {
		super("project");
	}

	static async hasProjects(id) {
		if (!id) return false;

		try {
			const projects = await ProjectModel.findFirst({
				workspaceId: id,
			});

			return !!projects;
		} catch (error) {
			Logger.error(error.message, `has projects fail`);
		}
	}

	static async getAllProjets(workspaceId) {
		if (!workspaceId) throw new Error("workspaceId is missing");

		try {
			return await ProjectModel.findMany({
				workspaceId,
			});
		} catch (error) {
			Logger.error(error.message, `Get all projects failed`);
		}
	}
}
