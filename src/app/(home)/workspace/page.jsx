import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import WorkspaceShell from "./WorkspaceShell";

export default async function WorkspacePage() {
	await Session.requireAuth();
	const user = await Session.getCurrentUser();

	const workspaceService = new WorkspaceService();
	const hasWorkspace = await workspaceService.hasWorkspace(user.id);

	if (!hasWorkspace) {
		return <WorkspaceShell />;
	}

	return <div className="">workspace</div>;
}
