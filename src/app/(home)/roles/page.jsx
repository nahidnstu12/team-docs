// app/workspaces/page.js

import prisma from "@/lib/prisma";
import WorkspaceList from "./List";
import { WorkspaceService } from "@/system/Services/WorkspaceService";
import Logger from "@/lib/Logger";

export default async function WorkspacesPage() {
	// const workspaces = await prisma.workspace.findMany({
	// 	orderBy: {
	// 		createdAt: "desc",
	// 	},
	// });
	const service = new WorkspaceService();
	const workspaces = await service.getAllWorkspaces();
	Logger.debug(workspaces, "workspace");
	// return <WorkspaceList workspaces={workspaces} />;
}
