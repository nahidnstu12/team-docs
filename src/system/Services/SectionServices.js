import { SectionDTO } from "../DTOs/SectionDTO";
import { SectionModel } from "../Models/SectionModel";
import { BaseService } from "./BaseService";
import Logger from "@/lib/Logger";

export class SectionServices extends BaseService {
	constructor() {
		super("section");
	}

	static async getAllSections(whereClause) {
		try {
			const sections = await SectionModel.findMany({ where: whereClause });
			return SectionDTO.toCollection(sections);
		} catch (error) {
			Logger.error(error.message, `Get all sections failed`);
		}
	}

	static async getAllSectionWithPages(whereClause) {
		try {
			const sections = await SectionModel.findMany({
				where: whereClause,
				include: { pages: true },
			});
			return SectionDTO.toCollection(sections);
		} catch (error) {
			Logger.error(error.message, `Get all sections failed`);
		}
	}

	static async hasSection(id) {
		if (!id) throw new Error("project id is missing");

		try {
			const section = await SectionModel.findFirst({
				where: {
					projectId: id,
				},
			});

			Logger.debug(section, "services");

			return !!section;
		} catch (error) {
			Logger.error(error.message, `has section fail`);
		}
	}

	static async getSection(id) {
		if (!id) throw new Error("section id is missing");

		try {
			const section = await SectionModel.findFirst({
				id,
			});

			const sectionDTO = SectionDTO.toResponse(section);
			return sectionDTO;
		} catch (error) {
			Logger.error(error.message, `section fetch fail`);
		}
	}
}
