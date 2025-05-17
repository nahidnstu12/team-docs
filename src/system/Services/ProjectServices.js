import Logger from "@/lib/Logger";
import { ProjectModel } from "../Models/ProjectModel";
import { BaseService } from "./BaseService";
import { ProjectDTO } from "../DTOs/ProjectDTO";

export class ProjectService extends BaseService {
	static modelName = "project";
	static dto = ProjectDTO;

	static async getResource({ id, slug }) {
		if (!id && !slug) return false;

		try {
			const whereConditions = [];
			if (id) whereConditions.push({ id });
			if (slug) whereConditions.push({ slug });

			const project = await ProjectModel.findFirst({
				where: {
					OR: whereConditions,
				},
			});

			const projectDTO = ProjectDTO.toResponse(project);
			return projectDTO;
		} catch (error) {
			Logger.error(error.message, `project fetch fail`);
		}
	}
}
