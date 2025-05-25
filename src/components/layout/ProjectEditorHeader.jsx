import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ProjectEditorHeader({ selectedPage, projectName }) {
	const saveHandler = useProjectStore((state) => state.saveHandler);
	const router = useRouter();

	const handleRedirect = () => {
		router.push("/projects");
		router.refresh();
	};

	return (
		<>
			<div id="project-header" className="flex items-center w-full h-12">
				<SidebarTrigger />

				<h1 className="pl-3 text-3xl font-semibold">
					<Button
						variant="ghost"
						size="icon"
						onClick={handleRedirect}
						className="transition hover:bg-muted"
					>
						<ArrowLeft className="w-5 h-5 text-gray-700" />
						<span className="sr-only">Go to Project Page</span>
					</Button>
					<span className="-ml-1">{projectName || "Project Name"}</span>
				</h1>

				{/* ✅ Save button if a page is selected */}
				{selectedPage && (
					<Button
						onClick={() => saveHandler && saveHandler()}
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
