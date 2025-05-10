"use server";

import { Session } from "@/lib/Session";
import { UserServices } from "@/system/Services/UserServices";

export async function getAllUsersFn() {
	const session = await Session.getCurrentUser();

	const users = await UserServices.getAllUsers(session.workspaceId);

	return users;
}
