import { Session } from "@/lib/Session";
import Sidebar from "./Sidebar";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import { ProjectService } from "@/system/Services/ProjectServices";

export default async function SidebarLayout() {
	await Session.requireAuth();
	const session = await Session.getCurrentUser();

	const workspace = await WorkspaceService.getWorkspace(session.id);
	const hasWorkspace = !!workspace;
	const hasProjects = workspace
		? await ProjectService.hasProjects(workspace.id)
		: false;

	return (
		<Sidebar
			session={session}
			hasWorkspace={hasWorkspace}
			hasProjects={hasProjects}
		/>
	);
}
