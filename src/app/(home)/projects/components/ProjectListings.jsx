"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Edit,
  LayoutTemplate,
  UsersRound,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProjectTableLoading from "./ProjectTableLoading";
import { useProjects } from "../hooks/useProjects";
import ClientErrorUI from "@/components/abstracts/clientErrorUI";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logger from "@/lib/Logger";
import ProjectEditDrawer from "./ProjectEditDrawer";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import TablePagination from "@/components/shared/TablePagination";

export default function ProjectListings({
  hasProjects,
  setIsDrawerOpen,
  startFetchProjects,
  setStartFetchProjects,
}) {
  const router = useRouter();
  const {
    data: projects,
    totalItems,
    pageSize,
    sortBy,
    sortOrder,
    handleSort,
    fetchError,
    showSkeleton,
  } = useProjects(startFetchProjects, setStartFetchProjects);

  // Function to render sort indicator icons
  const renderSortIcon = (column) => {
    if (column === sortBy) {
      return sortOrder === "asc" ? (
        <ChevronUp className="ml-2 w-4 h-4" />
      ) : (
        <ChevronDown className="ml-2 w-4 h-4" />
      );
    }
    return <ArrowUpDown className="ml-2 w-4 h-4 opacity-50" />;
  };

  // State for editing project
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleEditClick = (project) => {
    Logger.debug("Opening edit drawer for project", { projectId: project.id });
    setSelectedProject(project);
    setIsEditDrawerOpen(true);
  };

  if (fetchError) return <ClientErrorUI errorMessage={fetchError} retry={setStartFetchProjects} />;

  return (
    <section className="space-y-8">
      {/* Header with Create Button */}
      <section className="flex justify-between items-start pb-4 w-full max-h-14 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
        <div className="ml-auto">
          <CreateButtonShared onClick={() => setIsDrawerOpen(true)}>
            Create project
          </CreateButtonShared>
        </div>
      </section>

      {/* Project Edit Drawer */}
      {selectedProject && (
        <ProjectEditDrawer
          isDrawerOpen={isEditDrawerOpen}
          setIsDrawerOpen={setIsEditDrawerOpen}
          setStartFetchProjects={setStartFetchProjects}
          project={selectedProject}
        />
      )}

      {/* Project List */}
      <section className="mt-8 space-y-4">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="text-lg font-semibold tracking-wide">
              <TableHead
                className="w-[160px] px-6 py-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead className="w-[300px] px-6 py-4">Description</TableHead>
              <TableHead className="w-[320px] text-center px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* If no roles exist */}
            {!hasProjects ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-lg text-center text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            ) : showSkeleton || projects.length === 0 ? (
              /* If still loading */
              <ProjectTableLoading />
            ) : (
              /* If roles are loaded */
              projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="transition-colors duration-200 hover:bg-muted"
                >
                  {/* Your table cells content */}
                  <TableCell className="px-6 py-5 text-base font-semibold">
                    {project.name}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-base text-muted-foreground">
                    {project.description || (
                      <span className="text-sm italic text-gray-400">No description</span>
                    )}
                  </TableCell>

                  <TableCell className="flex gap-3 justify-center items-center px-6 py-5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex gap-1 items-center cursor-pointer"
                      onClick={() => {
                        router.push(`/projects/${project.slug}/editor`);
                        router.refresh();
                      }}
                    >
                      <LayoutTemplate className="w-4 h-4" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex gap-1 items-center bg-yellow-100 cursor-pointer"
                      onClick={() => handleEditClick(project)}
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Link href={`/projects/${project.slug}/assign-dev`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex gap-1 items-center bg-green-100 cursor-pointer"
                      >
                        <UsersRound className="w-4 h-4" /> Assign Dev
                      </Button>
                    </Link>
                    <DeleteConfirmationDialog
                      project={project}
                      setStartFetchProjects={setStartFetchProjects}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      {/* Pagination */}
      {hasProjects && !showSkeleton && projects.length > 0 && (
        <TablePagination totalItems={totalItems} itemsPerPage={pageSize} className="mt-6 mb-8" />
      )}
    </section>
  );
}
