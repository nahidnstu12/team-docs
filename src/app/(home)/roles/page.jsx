import { RoleService } from "@/system/Services/RoleServices";
import { Session } from "@/lib/Session";
import RoleShell from "./RoleShell";
import { PermissionServices } from "@/system/Services/PermissionServices";

export default async function RolePage() {
	const session = await Session.getCurrentUser();

	const [hasRoles, roles, hasPermissions] = await Promise.all([
		RoleService.hasRoles(session.id),
		RoleService.getAllRoles({
			OR: [{ isSystem: true }, { ownerId: session.id }],
		}),
		PermissionServices.hasPermissionResouces(session.id),
	]);

	return (
		<RoleShell
			roles={roles}
			hasRoles={hasRoles}
			hasPermissions={hasPermissions}
		/>
	);
}
