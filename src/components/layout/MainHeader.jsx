import { Session } from "@/lib/Session";
import { SidebarTrigger } from "../ui/sidebar";
import { WorkspaceService } from "@/system/Services/WorkspaceService";

export default async function Header() {
  const workspaceId = await Session.getWorkspaceIdForUser();
  const workspace = workspaceId
    ? await WorkspaceService.getResource({ where: { id: workspaceId } })
    : null;

  return (
    <header className="flex justify-between items-center px-4 pl-0 h-16 border-b bg-background">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">{workspace?.name || "workspace name"}</h1>
      </div>
    </header>
  );
}
