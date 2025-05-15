import { Session } from "@/lib/Session";
import UserShell from "./UserShell";
import Logger from "@/lib/Logger";

export default async function UsersPage() {
	const session = await Session.getCurrentUser();

	Logger.success(session);

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id);

	return <UserShell userId={session.id} />;
}
