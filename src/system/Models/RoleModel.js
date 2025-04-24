import { BaseModel } from "./BaseModel";

/**
 * Handles workspace-specific database operations
 * @extends BaseModel
 */
export class RoleModel extends BaseModel {
	constructor() {
		super("role");
	}
}
