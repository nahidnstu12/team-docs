import { RoleService } from "@/system/Services/RoleServices";
import { Session } from "@/lib/Session";
import RoleShell from "./RoleShell";
import { PermissionServices } from "@/system/Services/PermissionServices";
import Logger from "@/lib/Logger";

export default async function RolePage() {
	const session = await Session.getCurrentUser();
	const hasRoles = await RoleService.hasRoles(session.id);

	const roles = await RoleService.getAllRoles({
		OR: [{ isSystem: true }, { ownerId: session.id }],
	});

	const hasPermissions = await PermissionServices.hasPermissionResouces(
		session.id
	);

	return (
		<RoleShell
			roles={roles}
			hasRoles={hasRoles}
			hasPermissions={hasPermissions}
		/>
	);
}
