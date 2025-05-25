"use server";

import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { UserServices } from "@/system/Services/UserServices";

export async function getAllUsersFn() {
	const session = await Session.getCurrentUser();

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id);

	const users = await UserServices.getAllResources({ where: { workspaceId } });

	Logger.debug(users);

	return users;
}
