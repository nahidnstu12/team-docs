import { PrismaClient } from "@/app/generated/prisma";

export class BaseModel {
	constructor(modelName) {
		this.prisma = new PrismaClient();
		this.model = this.prisma[modelName]; // Automatically assigns Prisma model
	}

	async create(data) {
		return await this.model.create({ data });
	}

	async update(id, data) {
		return await this.model.update({
			where: { id },
			data,
		});
	}

	async delete(id) {
		return await this.model.delete({ where: { id } });
	}

	async findById(id) {
		return await this.model.findUnique({ where: { id } });
	}
}
