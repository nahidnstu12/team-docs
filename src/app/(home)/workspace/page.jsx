import { Session } from "@/lib/Session";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import WorkspaceShell from "./WorkspaceShell";
import { redirect } from "next/navigation";

export default async function WorkspacePage() {
	await Session.requireAuth();
	const user = await Session.getCurrentUser();

	const hasWorkspace = await WorkspaceService.hasWorkspace(user.id);

	if (!hasWorkspace) {
		return <WorkspaceShell />;
	}

	return redirect("/home");
}
