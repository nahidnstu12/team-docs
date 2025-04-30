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

	static async hasSection(id) {
		if (!id) throw new Error("project id is missing");

		try {
			const section = await SectionModel.findFirst({
				projectId: id,
			});

			return !!section;
		} catch (error) {
			Logger.error(error.message, `has section fail`);
		}
	}
}
