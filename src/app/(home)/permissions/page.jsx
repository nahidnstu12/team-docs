import PermissionShell from "./PermissionShell";

export default async function PermissionsPage() {
	// const session = await Session.getCurrentUser();

	// const hasPermission = await PermissionServices.hasPermissionResouces(
	// 	session.id
	// );

	return <PermissionShell hasPermission={true} />;
}
