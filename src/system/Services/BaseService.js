import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";

export class BaseService {
  static get model() {
    if (!this.modelName) throw new Error("modelName not defined in child class");
    return prisma[this.modelName];
  }

  static async hasResource({ where }) {
    try {
      const hasResource = await this.model.findFirst({ where });
      return !!hasResource;
    } catch (error) {
      Logger.error(error.message, "failed hasResource on BaseService");
    }
  }

  static async getResource({ where, include = {} }) {
    try {
      const resource = await this.model.findUnique({ where, include });

      Logger.debug(resource, "from get resource");

      if (this.dto && typeof this.dto.toResponse === "function") {
        return this.dto.toResponse(resource);
      }
    } catch (error) {
      Logger.error(error.message, "failed getResource on BaseService");
    }
  }

  static async getAllResources({ where = {}, orderBy = { createdAt: "desc" } }) {
    try {
      const allResources = await this.model.findMany({
        ...(where && { where }),
        orderBy,
      });

      if (this.dto && typeof this.dto.toCollection === "function") {
        return this.dto.toCollection(allResources);
      }

      return allResources;
    } catch (error) {
      Logger.error(error.message, "failed getAllResources on BaseService");
    }
  }
}
