import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import WorkspaceShell from "./WorkspaceShell";

export default async function WorkspacePage() {
	await Session.requireAuth();
	const user = await Session.getCurrentUser();

	const hasWorkspace = await WorkspaceService.hasResource({
		ownerId: user.id,
	});

	return <WorkspaceShell hasWorkspace={hasWorkspace} />;
}
