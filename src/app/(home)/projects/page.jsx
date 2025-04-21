import Logger from "@/lib/Logger";
import { Session } from "@/lib/Session";
import NoProjectUI from "./NoProjectUI";
import { ProjectService } from "@/system/Services/ProjectServices";

export default async function ProjectPage() {
	const session = await Session.getCurrentUser();
	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id); // should return null or a valid ID

	if (!workspaceId) return <NoProjectUI />;

	const projectService = new ProjectService();
	const hasNoProjects = await projectService.hasProjects(workspaceId);

	if (!hasNoProjects) return <NoProjectUI />;

	return <div className="">project page</div>;
}
