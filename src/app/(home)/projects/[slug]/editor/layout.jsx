import ProjectEditorSidebar from "@/components/layout/projectEditorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProjectEditorLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex overflow-hidden w-screen h-screen">
        <ProjectEditorSidebar />
        <div className="flex overflow-hidden flex-col flex-1 pl-3">
          <main className="flex-1 overflow-auto p-4 min-h-[80vh]">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
