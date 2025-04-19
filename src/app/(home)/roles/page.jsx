// app/workspaces/page.js

import prisma from "@/lib/prisma";
import WorkspaceList from "./List";

export default async function WorkspacesPage() {
	const workspaces = await prisma.workspace.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return <WorkspaceList workspaces={workspaces} />;
}
