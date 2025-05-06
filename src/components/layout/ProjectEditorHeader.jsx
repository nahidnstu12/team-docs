import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export default function ProjectEditorHeader({ hasSection }) {
	return (
		<>
			<div id="project-header" className="flex items-center w-full h-12 my-2">
				<SidebarTrigger />
				<h1 className="pl-3 text-3xl font-semibold">Project Name</h1>
				{/* {hasSection && (
					<Button
						onClick={() => setIsDialogOpen(true)}
						className="ml-auto mr-4 cursor-pointer"
					>
						Add A Section
					</Button>
				)} */}
			</div>
			<hr />
			<div className="mb-6"></div>
		</>
	);
}
