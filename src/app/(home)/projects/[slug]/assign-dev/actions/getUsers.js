"use server";

import { UserServices } from "@/system/Services/UserServices";

export async function getUsersNotInProject(projectId) {
	return UserServices.getUsersNotInProject(projectId);
}