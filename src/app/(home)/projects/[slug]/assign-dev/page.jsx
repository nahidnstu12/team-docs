import { ProjectService } from "@/system/Services/ProjectServices";
import AssignDevClient from "./components/AssignDevClient";

export default async function AssignDevPage({ params }) {
	const { slug } = params;
	const project = await ProjectService.getProject({ slug });

	return (
		<div className="container mx-auto py-6">
			<AssignDevClient 
				project={project}
			/>
		</div>
	);
}
