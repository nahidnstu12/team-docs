import { Session } from "@/lib/Session";
import WorkspaceForm from "./WorkspaceForm";
import { WorkspaceService } from "@/system/Services/WorkspaceService";

export default async function WorkspacePage() {
	await Session.requireAuth();
	const user = await Session.getCurrentUser();

	const workspaceService = new WorkspaceService();
	const hasWorkspace = await workspaceService.hasWorkspace(user.id);

	if (!hasWorkspace) return <WorkspaceForm />;

	return <div className="">workspace</div>;
}
