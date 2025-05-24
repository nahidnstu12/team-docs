import { Session } from "@/lib/Session";
import { SidebarTrigger } from "../ui/sidebar";
import { WorkspaceService } from "@/system/Services/WorkspaceService";

export default async function Header() {
	const session = await Session.getCurrentUser();

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id);

	let workspace = null;
	workspace =
		workspaceId === null
			? null
			: await WorkspaceService.getResource({
					where: { id: workspaceId },
			  });

	return (
		<header className="flex items-center justify-between h-16 px-4 border-b bg-background">
			<div className="flex items-center space-x-2">
				<SidebarTrigger />
				<h1 className="text-xl font-semibold">
					{workspace?.name || "workspace name"}
				</h1>
			</div>
		</header>
	);
}
