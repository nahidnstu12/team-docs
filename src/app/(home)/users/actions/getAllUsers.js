"use server";

import { Session } from "@/lib/Session";
import { UserServices } from "@/system/Services/UserServices";

export async function getAllUsersFn() {
	const session = await Session.getCurrentUser();

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id);

	const users = await UserServices.getAllUsers(workspaceId);

	return users;
}
