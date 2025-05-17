import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import WorkspaceShell from "./WorkspaceShell";
import Logger from "@/lib/Logger";

export default async function WorkspacePage() {
	await Session.requireAuth();
	const user = await Session.getCurrentUser();

	const hasWorkspace = await WorkspaceService.hasWorkspace(user.id);

	return <WorkspaceShell hasWorkspace={hasWorkspace} />;
}
