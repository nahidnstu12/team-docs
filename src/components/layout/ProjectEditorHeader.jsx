import { useProjectStore } from "@/app/(home)/projects/store/useProjectStore";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Upload, MoreVertical, Check } from "lucide-react";
import { usePreviewStore } from "@/app/(home)/projects/[slug]/editor/store/usePreviewStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProjectEditorHeader({ selectedPage, projectName }) {
  const saveHandler = useProjectStore((state) => state.saveHandler);
  const router = useRouter();

  // Preview store state and actions - now page specific
  const isPreviewMode = usePreviewStore((state) => state.isPageInPreviewMode(selectedPage));
  const togglePreviewMode = usePreviewStore((state) => state.togglePagePreviewMode);
  const isPublished = usePreviewStore((state) => state.isPagePublished(selectedPage));
  const setPublished = usePreviewStore((state) => state.setPagePublished);

  const handleRedirect = () => {
    router.push("/projects");
    router.refresh();
  };

  const handlePublish = () => {
    // TODO: Implement actual publishing logic
    if (selectedPage) {
      setPublished(selectedPage, true);
    }
  };

  return (
    <>
      <div id="project-header" className="flex items-center w-full h-12">
        <SidebarTrigger />

        <h1 className="pl-3 text-3xl font-semibold cursor-pointer" onClick={handleRedirect}>
          {projectName || "Project Name"}
        </h1>

        {/* ✅ Save button if a page is selected */}
        {selectedPage && (
          <div className="flex gap-2 items-center mr-4 ml-auto">
            <Button
              onClick={() => saveHandler && saveHandler()}
              className="px-6 py-2 bg-green-400 cursor-pointer hover:bg-green-500"
            >
              Save
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  <MoreVertical className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => selectedPage && togglePreviewMode(selectedPage)}
                  className="flex gap-2 items-center cursor-pointer"
                >
                  {isPreviewMode ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Preview Mode</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handlePublish}
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <hr />
      <div className="mb-6"></div>
    </>
  );
}
