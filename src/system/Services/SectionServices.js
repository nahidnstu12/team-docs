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
}
