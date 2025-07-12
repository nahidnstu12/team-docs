import { Session } from "@/lib/Session";
import { ProjectService } from "@/system/Services/ProjectServices";
import ProjectShell from "./ProjectShell";

export default async function ProjectPage() {
  const workspaceId = await Session.getWorkspaceIdForUser();

  const hasProjects = await ProjectService.hasResource({
    where: { workspaceId },
  });

  return <ProjectShell hasProjects={hasProjects} />;
}
