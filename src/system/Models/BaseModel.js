import Logger from "@/lib/Logger";
import prisma from "@/lib/prisma";

export class BaseModel {
	static get model() {
		if (!this.modelName)
			throw new Error("modelName not defined in child class");
		return prisma[this.modelName];
	}

	static async create(data) {
		return await this.model.create({ data });
	}

	static async upsert({ where, create, update }) {
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

	static async update({ where, data }) {
		return await this.model.update({
			where,
			data,
		});
	}

	static async delete(id) {
		return await this.model.delete({ where: { id } });
	}

	static async findUnique({ where, select }) {
		return await this.model.findUnique({ where, ...(select && { select }) });
	}

	static async findMany({ where, select, orderBy = { createdAt: "desc" } }) {
		return await this.model.findMany({
			...(where && { where }),
			...(select && { select }),
			orderBy,
		});
	}

	static async findFirst({ where }) {
		return await this.model.findFirst({ where });
	}
}
