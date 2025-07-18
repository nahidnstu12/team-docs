"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMembersPermissionListings } from "../actions/getMembersPermissionListings";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ModifyPermissionsDrawer from "./ModifyPermissionsDrawer";
import DeleteDevDialog from "./DeleteDevDialog";

export default function DevListings({
  projectId,
  refetchTrigger,
  onRemoveDevSuccess,
  projectName,
}) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const members = await getMembersPermissionListings(projectId);
        console.log(members, "members hit--");
        setMembers(members);
      } catch (err) {
        console.error("Error fetching developers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [projectId, refetchTrigger]);

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <TableRow key={i}>
          <TableCell className="px-6 py-5">
            <Skeleton className="h-6 w-[200px]" />
          </TableCell>
          <TableCell className="px-6 py-5">
            <Skeleton className="h-6 w-[300px]" />
          </TableCell>
          <TableCell className="px-6 py-5">
            <div className="flex items-center justify-center gap-3">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const handleModifyClick = (memberAndPermissions) => {
    setSelectedDeveloper(memberAndPermissions);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedDeveloper(null);
  };

  return (
    <section className="mt-8">
      {/* Header with Create Button */}
      <section className="flex items-start justify-between w-full pb-2 border-b max-h-14">
        <h1 className="text-3xl font-bold tracking-tight">Assigned Developers</h1>
      </section>
      {/* Project List */}
      <section className="mt-6 overflow-auto border shadow-lg rounded-2xl bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="text-lg font-semibold tracking-wide">
              <TableHead className="w-[160px] px-6 py-4">Name</TableHead>
              <TableHead className="w-[300px] px-6 py-4">Permissions</TableHead>
              <TableHead className="w-[320px] text-center px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-lg text-center text-muted-foreground">
                  No Developers found.
                </TableCell>
              </TableRow>
            ) : (
              members.map(({ user, permissions }) => (
                <TableRow key={user.id} className="transition-colors duration-200 hover:bg-muted">
                  <TableCell className="px-6 py-5 text-base font-semibold">
                    {user.username}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-base text-muted-foreground">
                    {permissions.map((perm) => perm.name).join(", ")}
                  </TableCell>

                  <TableCell className="flex items-center justify-center gap-3 px-6 py-5">
                    <Button
                      variant="outline"
                      onClick={() => handleModifyClick({ user, permissions })}
                    >
                      Modify
                    </Button>

                    <DeleteDevDialog
                      userId={user.id}
                      projectId={projectId}
                      onRemoveDevSuccess={onRemoveDevSuccess}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
      <ModifyPermissionsDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        memberAndPermissions={selectedDeveloper}
        projectName={projectName}
        projectId={projectId}
        onSuccess={onRemoveDevSuccess}
      />
    </section>
  );
}
