import { RoleService } from "@/system/Services/RoleServices";
import { Session } from "@/lib/Session";
import RoleShell from "./RoleShell";
import { ProjectService } from "@/system/Services/ProjectServices";
import { redirect } from "next/navigation";
import { UserModel } from "@/system/Models/UserModel";

export default async function RolePage() {
	const session = await Session.getCurrentUser();
	// const user = await UserModel.findFirst({ where: { id: session.id } });
	// const hasProject = await ProjectService.hasProjects(user.workspaceId);

	// if (!hasProject) redirect("/workspace");

	const hasRoles = await RoleService.hasRoles(session.id);

	return <RoleShell hasRoles={hasRoles} />;
}
