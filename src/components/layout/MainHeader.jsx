import { Session } from "@/lib/Session";
import { SidebarTrigger } from "../ui/sidebar";
import { WorkspaceService } from "@/system/Services/WorkspaceService";

import { headers } from "next/headers";
import ProjectNameDisplay from "./ProjectNameDisplay";

export default async function Header() {
  const workspaceId = await Session.getWorkspaceIdForUser();
  const workspace = workspaceId
    ? await WorkspaceService.getResource({ where: { id: workspaceId } })
    : null;

  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  const isAssignDevRoute = pathname?.includes("/projects/") && pathname?.includes("/assign-dev");

  return (
    <header className="flex justify-between items-center px-4 pl-0 h-16 border-b bg-background">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{workspace?.name || "workspace name"}</h1>
          {isAssignDevRoute && (
            <ProjectNameDisplay />
          )}
        </div>
      </div>
    </header>
  );
}
