import { Session } from "@/lib/Session";
import { ProjectService } from "@/system/Services/ProjectServices";
import { redirect } from "next/navigation";
import ProjectShell from "./ProjectShell";

export default async function ProjectPage() {
	const session = await Session.getCurrentUser();

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id);

	// if (!workspaceId) return redirect("/workspace");

	const hasProjects = await ProjectService.hasProjects(workspaceId);

	return <ProjectShell hasProjects={hasProjects} />;
}
