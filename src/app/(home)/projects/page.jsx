import { Session } from "@/lib/Session";
import { ProjectService } from "@/system/Services/ProjectServices";
import ProjectShell from "./ProjectShell";

export default async function ProjectPage() {
	const session = await Session.getCurrentUser();

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.workspaceId);

	const hasProjects = await ProjectService.hasResource({
		where: { workspaceId },
	});

	return <ProjectShell hasProjects={hasProjects} />;
}
