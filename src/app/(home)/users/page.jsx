import { Session } from "@/lib/Session";
import UserShell from "./UserShell";

export default async function UsersPage() {
	const session = await Session.getCurrentUser();

	return <UserShell userId={session.id} />;
}
