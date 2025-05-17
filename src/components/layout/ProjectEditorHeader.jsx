import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

export default function ProjectEditorHeader({ selectedPage }) {
	const saveHandler = useProjectStore((state) => state.saveHandler);

	return (
		<>
			<div id="project-header" className="flex items-center w-full h-12 my-2">
				<SidebarTrigger />
				<h1 className="pl-3 text-3xl font-semibold">Project Name</h1>

				{selectedPage && (
					<Button
						onClick={() => {
							if (saveHandler) saveHandler(); // 🔥 Call RTE save
						}}
						className="px-6 py-2 ml-auto mr-4 bg-green-400 cursor-pointer hover:bg-green-500"
					>
						Save
					</Button>
				)}
			</div>
			<hr />
			<div className="mb-6"></div>
		</>
	);
}
