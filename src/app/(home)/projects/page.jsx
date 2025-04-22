import { Session } from "@/lib/Session";
import NoProjectUI from "./NoProjectUI";
import { ProjectService } from "@/system/Services/ProjectServices";
import ProjectListings from "./ProjectListings";

export default async function ProjectPage() {
	const session = await Session.getCurrentUser();

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id);

	if (!workspaceId) return <NoProjectUI />;

	const projectService = new ProjectService();
	const hasNoProjects = await projectService.hasProjects(workspaceId);

	if (!hasNoProjects) return <NoProjectUI />;

	const projects = await projectService.getAllProjets(workspaceId);

	return <ProjectListings projects={projects} />;
}
