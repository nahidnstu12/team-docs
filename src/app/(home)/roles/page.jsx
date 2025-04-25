import { RoleService } from "@/system/Services/RoleServices";
import { Session } from "@/lib/Session";
import RoleShell from "./RoleShell";

export default async function RolePage() {
	const session = await Session.getCurrentUser();
	const hasRoles = await RoleService.hasRoles(session.id);

	return <RoleShell hasRoles={hasRoles} />;
}
