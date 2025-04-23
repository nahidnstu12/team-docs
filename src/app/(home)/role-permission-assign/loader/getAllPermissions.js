"use server";
import { RolePermissionAssignServices } from "@/system/Services/RolePermissionAssignServices";

export async function getAllPermissions() {
	const service = new RolePermissionAssignServices();
	const permissions = await service.getAllPermissions(); // this uses Prisma
	return permissions;
}
