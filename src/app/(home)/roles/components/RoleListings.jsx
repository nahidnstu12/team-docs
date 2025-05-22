"use client";

import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import { useRoles } from "../hooks/useRoles";
import TableLoading from "@/components/loading/TableLoading";
import DrawerLoading from "@/components/loading/DialogLoading";
import ClientErrorUI from "@/components/abstracts/clientErrorUI";
import RoleEditDialog from "./RoleEditDialog";
import DeleteRoleDialog from "./DeleteRoleDialog";
import TablePagination from "@/components/shared/TablePagination";

const LoadRolePermissionDialogLazy = dynamic(
  () => import("@/app/(home)/role-permission-assign/RolePermissionDialog"),
  {
    ssr: false,
    loading: () => <DrawerLoading />,
  }
);

export default function RoleListings({
  hasRoles,
  setIsDialogOpen,
  shouldStartFetchRoles,
  setShouldStartFetchRoles,
}) {
  const {
    data: allRoles,
    totalItems,
    pageSize,
    sortBy,
    sortOrder,
    handleSort,
    fetchError,
    showSkeleton,
    selectedRoleId,
    openPermissionAssignDialog,
    setOpenPermissionAssignDialog,
  } = useRoles(shouldStartFetchRoles, setShouldStartFetchRoles);
  
  // Function to render sort indicator icons
  const renderSortIcon = (column) => {
    if (column === sortBy) {
      return sortOrder === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-2 h-4 w-4" />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
  };

  // State for editing role
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  if (fetchError)
    return <ClientErrorUI errorMessage={fetchError} retry={setShouldStartFetchRoles} />;

  return (
    <>
      {/* Edit Role Dialog */}
      {selectedRole && (
        <RoleEditDialog
          isDialogOpen={isEditDialogOpen}
          setIsDialogOpen={setIsEditDialogOpen}
          setShouldStartFetchRoles={setShouldStartFetchRoles}
          role={selectedRole}
        />
      )}

      <section className="flex justify-between items-start mb-8 w-full max-h-14">
        <h1 className="text-3xl font-bold">Roles</h1>
        <div className="ml-auto">
          <CreateButtonShared onClick={() => setIsDialogOpen(true)}>Create Role</CreateButtonShared>
        </div>
      </section>
      <div className="overflow-auto rounded-2xl border shadow-lg bg-background">
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
              <TableHead 
                className="w-[100px] text-center px-6 py-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("isSystem")}
              >
                <div className="flex items-center justify-center">
                  System?
                  {renderSortIcon("isSystem")}
                </div>
              </TableHead>
              <TableHead className="w-[320px] text-center px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* If no roles exist */}
            {!hasRoles ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-lg text-center text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : showSkeleton || allRoles.length === 0 ? (
              /* If still loading */
              <TableLoading />
            ) : (
              /* If roles are loaded */
              allRoles.map((role) => (
                <TableRow key={role.id} className="transition-colors duration-200 hover:bg-muted">
                  {/* Your table cells content */}
                  <TableCell className="px-6 py-5 text-base font-semibold">{role.name}</TableCell>
                  <TableCell className="px-6 py-5 text-base text-muted-foreground">
                    {role.description || (
                      <span className="text-sm italic text-gray-400">No description</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center">
                    {role.isSystem ? (
                      <span className="font-medium text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-3 justify-center items-center px-6 py-5">
                    <Button
                      onClick={() => {
                        setOpenPermissionAssignDialog(true);
                        selectedRoleId.current = role.id;
                      }}
                      size="sm"
                      variant="outline"
                      className="text-green-700 hover:text-green-500 border-green-500 hover:bg-green-100 hover:border-green-600 px-5 py-2.5 text-base cursor-pointer"
                    >
                      <ShieldCheck className="mr-2 w-5 h-5 text-green-600" />
                      Assign
                    </Button>

                    {openPermissionAssignDialog && selectedRoleId.current === role.id && (
                      <LoadRolePermissionDialogLazy
                        isOpen={openPermissionAssignDialog}
                        onOpenChange={setOpenPermissionAssignDialog}
                        roleId={selectedRoleId.current}
                      />
                    )}

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditClick(role)}
                      className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 px-5 py-2.5 text-base cursor-pointer"
                    >
                      <Pencil className="mr-2 w-5 h-5 text-yellow-600" />
                      Edit
                    </Button>

                    <DeleteRoleDialog
                      role={role}
                      setShouldStartFetchRoles={setShouldStartFetchRoles}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {hasRoles && !showSkeleton && allRoles.length > 0 && (
        <TablePagination
          totalItems={totalItems}
          itemsPerPage={pageSize}
          className="mb-8"
        />
      )}
    </>
  );
}
