import { RoleService } from "@/system/Services/RoleServices";
import { Session } from "@/lib/Session";
import RoleShell from "./RoleShell";

export default async function RolePage() {
	const session = await Session.getCurrentUser();
	const roleService = new RoleService();
	const hasRoles = await roleService.hasRoles(session.id);

	const roles = await roleService.getAllRoles({
		OR: [{ isSystem: true }, { ownerId: session.id }],
	});

	return <RoleShell roles={roles} hasRoles={hasRoles} />;
}
