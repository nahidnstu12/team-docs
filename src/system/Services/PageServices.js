import { PageDTO } from "../DTOs/PageDTO";
import { BaseService } from "./BaseService";
import { PageModel } from "../Models/PageModel";
import Logger from "@/lib/Logger";

export class PageServices extends BaseService {
	static modelName = "page";
	static dto = PageDTO;

	static async updateResource(id, data) {
		try {
			Logger.debug(`Updating page with id: ${id}`, data);
			const updatedPage = await PageModel.update({
				where: { id },
				data,
			});

			return updatedPage;
		} catch (error) {
			Logger.error(error.message, `Page update failed`);
			throw error;
		}
	}

	static async deleteResource(id) {
		try {
			Logger.debug(`Deleting page with id: ${id}`);
			await PageModel.delete({
				where: { id },
			});
			return true;
		} catch (error) {
			Logger.error(error.message, `Page delete failed`);
			throw error;
		}
	}

	static async getPage(id) {
		try {
			const page = await PageModel.findFirst({
				where: { id },
				include: { section: { include: { project: true } } },
			});
			return page;
		} catch (error) {
			Logger.error(error.message, `Get page failed`);
			throw error;
		}
	}
}
