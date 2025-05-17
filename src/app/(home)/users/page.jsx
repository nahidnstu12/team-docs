import { Session } from "@/lib/Session";
import UserShell from "./UserShell";

export default async function UsersPage() {
	const session = await Session.getCurrentUser();

	let workspaceId = session.workspaceId;

	if (workspaceId === null)
		workspaceId = await Session.getWorkspaceId(session.id);

	return <UserShell userId={session.id} />;
}
