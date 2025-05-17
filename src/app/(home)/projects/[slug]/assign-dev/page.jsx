import { ProjectService } from "@/system/Services/ProjectServices";
import AssignDevClient from "./components/AssignDevClient";

export default async function AssignDevPage({ params }) {
	const { slug } = await params;
	const project = await ProjectService.getResource({ slug });

	return (
		<div className="container mx-auto">
			<AssignDevClient project={project} />
		</div>
	);
}
