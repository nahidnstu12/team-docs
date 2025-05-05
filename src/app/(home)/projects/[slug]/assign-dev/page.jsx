import AssignDevHeader from "./components/AssignDevHeader";
import DevListings from "./components/DevListings";
import { ProjectService } from "@/system/Services/ProjectServices";

export default async function ProjectAssignDevPage({ params }) {
	const { slug } = await params;
	const project = await ProjectService.getProject({ slug });

	return (
		<div className="">
			<AssignDevHeader projectName={project.name} projectId={project.id} />
			<DevListings projectId={project.id} />
		</div>
	);
}
