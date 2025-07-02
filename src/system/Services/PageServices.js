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

  /**
   * Extract the base name from a page title, removing copy suffixes
   * @param {string} title - The page title
   * @returns {string} - The base name without copy suffixes
   */
  static extractBaseName(title) {
    // Pattern to match " - Copy" or " - Copy N" at the end
    const copyPattern = /^(.+?) - Copy(?: \d+)?$/;
    const match = title.match(copyPattern);
    return match ? match[1] : title;
  }

  /**
   * Generate the next available copy name for a page
   * @param {string} baseName - The base name of the page
   * @param {string} sectionId - The section ID to search within
   * @returns {Promise<string>} - The next available copy name
   */
  static async generateCopyName(baseName, sectionId) {
    // Find all existing copies in the same section
    const copyPattern = `${baseName} - Copy`;
    const existingCopies = await PageModel.findMany({
      where: {
        AND: [
          { sectionId },
          {
            OR: [
              { title: copyPattern }, // "baseName - Copy"
              { title: { startsWith: `${copyPattern} ` } }, // "baseName - Copy N"
            ],
          },
        ],
      },
      select: { title: true },
    });

    // If no copies exist, return the first copy name
    if (existingCopies.length === 0) {
      return copyPattern;
    }

    // Extract numbers from existing copies and find the next available number
    const numberPattern = new RegExp(`^${this.escapeRegex(copyPattern)}(?: (\\d+))?$`);
    const numbers = existingCopies
      .map((page) => {
        const match = page.title.match(numberPattern);
        return match && match[1] ? parseInt(match[1], 10) : 1;
      })
      .filter((n) => !isNaN(n));

    // Find the next available number
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `${copyPattern} ${maxNumber + 1}`;
  }

  /**
   * Escape special regex characters in a string
   * @param {string} string - The string to escape
   * @returns {string} - The escaped string
   */
  static escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  static async duplicatePage(id, userId) {
    try {
      Logger.debug(`Duplicating page with id: ${id}`);

      // Get the original page with all its content
      const originalPage = await PageModel.findFirst({
        where: { id },
        include: { section: true },
      });

      if (!originalPage) {
        throw new Error(`Page with id ${id} not found`);
      }

      // Extract the base name and generate the next copy name
      const baseName = this.extractBaseName(originalPage.title);
      const newTitle = await this.generateCopyName(baseName, originalPage.sectionId);

      // Create the duplicate page with the determined title
      const duplicatedPage = await PageModel.create({
        title: newTitle,
        description: originalPage.description,
        content: originalPage.content, // Copy the content JSON
        section: {
          connect: {
            id: originalPage.sectionId,
          },
        },
        creator: {
          connect: {
            id: userId,
          },
        },
      });

      return duplicatedPage;
    } catch (error) {
      Logger.error(error.message, `Page duplication failed`);
      throw error;
    }
  }
}
