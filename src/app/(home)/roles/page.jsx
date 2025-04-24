import { RoleService } from "@/system/Services/RoleServices";
import { Session } from "@/lib/Session";
import RolesLisitngs from "./RoleListings";
import NoRolesUI from "./NoRolesUI";
import Logger from "@/lib/Logger";
import RoleShell from "./RoleShell";

export default async function RolePage() {
	const session = await Session.getCurrentUser();
	const roleService = new RoleService();
	const hasRoles = await roleService.hasRoles(session.id);

	// if (!hasRoles)
	// 	return (
	// 		<div className="flex justify-between p-6 mx-auto">
	// 			<NoRolesUI />
	// 		</div>
	// 	);

	const roles = await roleService.getAllRoles({
		OR: [{ isSystem: true }, { ownerId: session.id }],
	});

	// return <RolesLisitngs roles={roles} />;
	return <RoleShell roles={roles} hasRoles={hasRoles} />;
}
