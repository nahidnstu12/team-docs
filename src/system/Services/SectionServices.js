import { SectionDTO } from "../DTOs/SectionDTO";
import { SectionModel } from "../Models/SectionModel";
import { BaseService } from "./BaseService";
import Logger from "@/lib/Logger";

export class SectionServices extends BaseService {
	static modelName = "section";
	static dto = SectionDTO;

	static async getAllSectionWithPages(whereClause) {
		try {
			const sections = await SectionModel.findMany({
				where: whereClause,
				include: { pages: true },
				orderBy: { createdAt: "asc" },
			});
			return SectionDTO.toCollection(sections);
		} catch (error) {
			Logger.error(error.message, `Get all sections failed`);
		}
	}

	static async updateResource(id, data) {
		try {
			Logger.debug(`Updating section with id: ${id}`, data);
			const updatedSection = await SectionModel.update({
				where: { id },
				data,
			});

			return SectionDTO.toResponse(updatedSection);
		} catch (error) {
			Logger.error(error.message, `Section update failed`);
			throw error;
		}
	}

	static async deleteResource(id) {
		try {
			Logger.debug(`Deleting section with id: ${id}`);
			await SectionModel.delete({
				where: { id },
			});
			return true;
		} catch (error) {
			Logger.error(error.message, `Section delete failed`);
			throw error;
		}
	}

	static async getSection(id) {
		try {
			const section = await SectionModel.findFirst({
				where: { id },
				include: { project: true },
			});
			return section;
		} catch (error) {
			Logger.error(error.message, `Get section failed`);
			throw error;
		}
	}
}
