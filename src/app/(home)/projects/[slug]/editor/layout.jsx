import ProjectEditorSidebar from "@/components/layout/ProjectEditorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function ProjectEditorLayout({ children }) {
	return (
		<SidebarProvider>
			<div className="flex w-screen h-screen overflow-hidden ">
				<ProjectEditorSidebar />
				<div className="flex flex-col flex-1 pl-3 overflow-hidden">
					<Toaster position="top-right" richColors />
					<main className="flex-1 overflow-auto p-4 min-h-[80vh]">
						{children}
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
