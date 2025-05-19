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

	static async duplicatePage(id, userId) {
		try {
			Logger.debug(`Duplicating page with id: ${id}`);
			
			// Get the original page with all its content
			const originalPage = await PageModel.findFirst({
				where: { id },
				include: { section: true }
			});
			
			if (!originalPage) {
				throw new Error(`Page with id ${id} not found`);
			}

			// Check for existing copies to handle numbering
			const baseCopyTitle = `${originalPage.title} - Copy`;
			const existingCopies = await PageModel.findMany({
				where: {
					AND: [
						{ sectionId: originalPage.sectionId },
						{
							OR: [
								{ title: baseCopyTitle },
								{ title: { startsWith: `${baseCopyTitle} ` } }
							]
						}
					]
				}
			});

			// Determine the title with appropriate numbering
			let newTitle = baseCopyTitle;
			if (existingCopies.length > 0) {
				// Extract numbers from existing copies
				const numberPattern = new RegExp(`^${baseCopyTitle}(?: (\d+))?$`);
				const numbers = existingCopies
					.map(page => {
						const match = page.title.match(numberPattern);
						return match && match[1] ? parseInt(match[1], 10) : 1;
					})
					.filter(n => !isNaN(n));

				// Find the next available number
				const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
				newTitle = `${baseCopyTitle} ${maxNumber + 1}`;
			}

			// Create the duplicate page with the determined title
			const duplicatedPage = await PageModel.create({
				title: newTitle,
				description: originalPage.description,
				content: originalPage.content, // Copy the content JSON
				section: {
					connect: {
						id: originalPage.sectionId
					}
				},
				creator: {
					connect: {
						id: userId
					}
				}
			});

			return duplicatedPage;
		} catch (error) {
			Logger.error(error.message, `Page duplication failed`);
			throw error;
		}
	}
}
