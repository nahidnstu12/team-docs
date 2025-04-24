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

	const hasNoProjects = await ProjectService.hasProjects(workspaceId);

	if (!hasNoProjects) return <NoProjectUI />;

	const projects = await ProjectService.getAllProjets(workspaceId);

	return <ProjectListings projects={projects} />;
}
