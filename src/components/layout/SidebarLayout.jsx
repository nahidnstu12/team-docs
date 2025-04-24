import { Session } from "@/lib/Session";
import Sidebar from "./Sidebar";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import { ProjectService } from "@/system/Services/ProjectServices";

export default async function SidebarLayout() {
	await Session.requireAuth();
	const session = await Session.getCurrentUser();

	const workspaceService = new WorkspaceService();
	const projectService = new ProjectService();

	const workspace = await workspaceService.getWorkspace(session.id);
	const hasWorkspace = !!workspace;
	const hasProjects = workspace
		? await projectService.hasProjects(workspace.id)
		: false;

	return (
		<Sidebar
			session={session}
			hasWorkspace={hasWorkspace}
			hasProjects={hasProjects}
		/>
	);
}
