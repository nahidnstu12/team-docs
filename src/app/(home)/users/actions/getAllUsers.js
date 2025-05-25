"use server";

import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import { UserServices } from "@/system/Services/UserServices";

export async function getAllUsersFn() {
	const workspaceId = await Session.getWorkspaceIdForUser();

	const users = await UserServices.getAllResources({ where: { workspaceId } });

	Logger.debug("users>>", users.length);

	return users;
}
