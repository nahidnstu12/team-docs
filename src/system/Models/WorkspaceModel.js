// "use server";

import { BaseModel } from "./BaseModel";

export class WorkspaceModel extends BaseModel {
	constructor() {
		super("workspace");
	}

	async findByEmail(email) {
		return await this.model.findUnique({ where: { email } });
	}
}
