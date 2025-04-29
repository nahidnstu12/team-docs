import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export default function ProjectEditorHeader() {
	return (
		<div id="project-header" className="flex items-center w-full h-12 my-4">
			<SidebarTrigger />
			<h1 className="pl-3 text-3xl font-semibold">Project Name</h1>
			<Button className="ml-auto mr-12 cursor-pointer">Add A Section</Button>
		</div>
	);
}
