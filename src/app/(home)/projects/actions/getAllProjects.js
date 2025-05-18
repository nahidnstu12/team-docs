"use server";

import { Session } from "@/lib/Session";
import { ProjectService } from "@/system/Services/ProjectServices";

export async function getAllProjectsFn() {
	const workspaceId = await Session.getWorkspaceIdForUser();

	const projects = await ProjectService.getAllResources({
		where: { workspaceId },
	});

	return projects;
}
