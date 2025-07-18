import { ProjectService } from "@/system/Services/ProjectServices";
import AssignDevClient from "./components/AssignDevClient";
import ProjectInitializer from "./components/ProjectInitializer";

export default async function AssignDevPage({ params }) {
  const { slug } = await params;
  const project = await ProjectService.getResource({ slug });

  return (
    <div className="container mx-auto">
      <ProjectInitializer project={project} />
      <AssignDevClient project={project} workspaceId={project.workspaceId} />
    </div>
  );
}
