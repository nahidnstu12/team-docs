import { BaseModel } from "./BaseModel";

/**
 * Handles workspace-specific database operations
 * @extends BaseModel
 */
export class RolePermissionAssignModel extends BaseModel {
	constructor() {
		super("rolePermissionAssignment");
	}
}
