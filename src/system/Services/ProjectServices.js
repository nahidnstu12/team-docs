import Logger from "@/lib/Logger";
import { ProjectModel } from "../Models/ProjectModel";
import { BaseService } from "./BaseService";
import { ProjectDTO } from "../DTOs/ProjectDTO";

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

	static async getProject({ id, slug }) {
		if (!id && !slug) return false;

		try {
			const project = await ProjectModel.findFirst({
				OR: [id ? { id } : undefined, slug ? { slug } : undefined],
			});

			const projectDTO = ProjectDTO.toResponse(project);
			return projectDTO;
		} catch (error) {
			Logger.error(error.message, `project fetch fail`);
		}
	}

	static async getAllProjets(workspaceId) {
		if (!workspaceId) throw new Error("workspaceId is missing");

		try {
			return await ProjectModel.findMany({
				where: { workspaceId },
			});
		} catch (error) {
			Logger.error(error.message, `Get all projects failed`);
		}
	}
}
