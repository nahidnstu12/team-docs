import { ProjectService } from "@/system/Services/ProjectServices";
import AssignDevClient from "./components/AssignDevClient";
import Logger from "@/lib/Logger";

export default async function AssignDevPage({ params }) {
	const { slug } = params;
	const project = await ProjectService.getProject({ slug });

	Logger.debug(project, "getting project from assign-dev");
	return (
		<div className="container py-6 mx-auto">
			<AssignDevClient project={project} />
		</div>
	);
}
