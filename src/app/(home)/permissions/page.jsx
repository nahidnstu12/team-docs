import { Session } from "@/lib/Session";
import { PermissionServices } from "@/system/Services/PermissionServices";
import PermissionShell from "./PermissionShell";
import { RoleService } from "@/system/Services/RoleServices";
import { redirect } from "next/navigation";

export default async function PermissionsPage() {
	const session = await Session.getCurrentUser();

	// const hasRoles = await RoleService.hasRoles(session.id);

	// if (!hasRoles) redirect("/roles");

	const hasPermission = await PermissionServices.hasPermissionResouces(
		session.id
	);


	return <PermissionShell hasPermission={hasPermission} />;
}
