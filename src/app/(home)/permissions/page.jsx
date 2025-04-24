import { Session } from "@/lib/Session";
import { PermissionServices } from "@/system/Services/PermissionServices";
import PermissionShell from "./PermissionShell";
import Logger from "@/lib/Logger";

export default async function PermissionsPage() {
	const session = await Session.getCurrentUser();

	const hasPermissionResouces = await PermissionServices.hasPermissionResouces(
		session.id
	);

	const permissions = await PermissionServices.getAllPermissions({
		ownerId: session.id,
	});

	Logger.debug(hasPermissionResouces);

	return (
		<PermissionShell
			permissions={permissions}
			hasPermissionResouces={hasPermissionResouces}
		/>
	);
}
