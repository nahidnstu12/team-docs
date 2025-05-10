import { PageDTO } from "../DTOs/PageDTO";
import { PageModel } from "../Models/PageModel";
import { BaseService } from "./BaseService";
import Logger from "@/lib/Logger";

export class PageServices extends BaseService {
	constructor() {
		super("page");
	}

	static async getAllPages(whereClause) {
		try {
			const pages = await PageModel.findMany({ where: whereClause });
			return PageDTO.toCollection(pages);
		} catch (error) {
			Logger.error(error.message, `Get all pages failed`);
		}
	}
}
