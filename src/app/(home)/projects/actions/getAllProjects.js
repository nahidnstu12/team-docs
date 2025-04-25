"use server";

import { Session } from "@/lib/Session";
import { ProjectService } from "@/system/Services/ProjectServices";

export async function fetchAllProjectsFn() {
	const session = await Session.getCurrentUser();

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id);

	const projects = await ProjectService.getAllProjets(workspaceId);

	return projects;
}
