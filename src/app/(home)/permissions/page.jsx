import { PermissionServices } from "@/system/Services/PermissionServices";
import PermissionShell from "./PermissionShell";
import { Session } from "@/lib/Session";

export default async function PermissionsPage() {
	const session = await Session.getCurrentUser();

	const hasPermission = await PermissionServices.hasResource({
		where: { ownerId: session.id },
	});

	return <PermissionShell hasPermission={hasPermission} />;
}
