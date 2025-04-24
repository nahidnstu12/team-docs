import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";

/**
 * Abstract base class for all models
 * Handles common database operations
 */
export class BaseModel {
	/**
	 * Creates a BaseModel instance
	 * @param {string} modelName - Prisma model name
	 */
	constructor(modelName) {
		this.prisma = prisma;
		this.model = this.prisma[modelName];
	}

	/**
	 * Creates a new record
	 * @param {Object} data - Data to create
	 * @returns {Promise<Object>} Created record
	 */
	async create(data) {
		return await this.model.create({ data });
	}

	async upsert({ where, create, update }) {
		try {
			return await this.model.upsert({
				where,
				create,
				update,
			});
		} catch (error) {
			Logger.error(error.message, `Upsert failed`);
			throw error;
		}
	}

	/**
	 * Updates an existing record
	 * @param {string|number} id - Record ID
	 * @param {Object} data - Data to update
	 * @returns {Promise<Object>} Updated record
	 */
	async update(id, data) {
		return await this.model.update({
			where: { id },
			data,
		});
	}

	/**
	 * Deletes a record
	 * @param {string|number} id - Record ID
	 * @returns {Promise<Object>} Deleted record
	 */
	async delete(id) {
		return await this.model.delete({ where: { id } });
	}

	/**
	 * Finds a record by ID
	 * @param {string|number} id - Record ID
	 * @returns {Promise<Object|null>} Found record or null
	 */
	async findById(id) {
		return await this.model.findUnique({ where: { id } });
	}

	/**
	 * Finds all resource
	 * @returns {Promise<Array>} Array of resources
	 */
	async findMany({ where, select, orderBy = { createdAt: "desc" } }) {
		return await this.model.findMany({
			...(where && { where }),
			...(select && { select }),
			orderBy,
		});
	}

	async findFirst(whereClause) {
		return await this.model.findFirst({
			where: whereClause,
		});
	}
}
