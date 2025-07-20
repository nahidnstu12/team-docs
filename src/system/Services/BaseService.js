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

  static async getResource({
    where,
    include = null,
    select = null,
    // orderBy = { createdAt: "desc" },
  }) {
    try {
      if (include && select) {
        throw new Error("You cannot use both 'select' and 'include' in the same Prisma query.");
      }

      const queryOptions = {
        ...(where && { where }),
        // orderBy,
      };

      if (include) queryOptions.include = include;
      else if (select) queryOptions.select = select;

      const resource = await this.model.findUnique(queryOptions);

      if (this.dto && typeof this.dto.toResponse === "function") {
        return this.dto.toResponse(resource);
      }
    } catch (error) {
      Logger.error(error.message, "failed getResource on BaseService");
    }
  }

  static async countResources({ where = {} }) {
    try {
      const count = await this.model.count({ where });
      return count;
    } catch (error) {
      Logger.error(error.message, "failed countResources on BaseService");
      return 0;
    }
  }

  static async getAllResources({
    where = {},
    orderBy = { createdAt: "desc" },
    pagination = null,
    include = null,
    select = null,
  }) {
    try {
      if (include && select) {
        throw new Error("You cannot use both 'select' and 'include' in the same Prisma query.");
      }

      const queryOptions = {
        ...(where && { where }),
        orderBy,
      };

      if (include) queryOptions.include = include;
      else if (select) queryOptions.select = select;

      // Add pagination if provided
      if (pagination) {
        const { skip, take } = pagination;
        queryOptions.skip = skip;
        queryOptions.take = take;
      }

      const allResources = await this.model.findMany(queryOptions);

      if (this.dto && typeof this.dto.toCollection === "function") {
        return this.dto.toCollection(allResources);
      }

      return allResources;
    } catch (error) {
      Logger.error(error.message, "failed getAllResources on BaseService");
      return [];
    }
  }
}
