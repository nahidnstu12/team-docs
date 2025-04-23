import { BaseModel } from "./BaseModel";

/**
 * Handles workspace-specific database operations
 * @extends BaseModel
 */
export class PermissionModel extends BaseModel {
	constructor() {
		super("permission");
	}
}
