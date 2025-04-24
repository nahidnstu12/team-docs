import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import WorkspaceFormShell from "./WorkspaceFormShell";

export default async function WorkspacePage() {
	await Session.requireAuth();
	const user = await Session.getCurrentUser();

	const workspaceService = new WorkspaceService();
	const hasWorkspace = await workspaceService.hasWorkspace(user.id);

	if (!hasWorkspace) {
		return <WorkspaceFormShell />;
	}

	return <div className="">workspace</div>;
}
