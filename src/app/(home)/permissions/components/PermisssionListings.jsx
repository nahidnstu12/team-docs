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
import { Button } from "@/components/ui/button";
import { Pencil, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import TableLoading from "@/components/loading/TableLoading";
import ClientErrorUI from "@/components/abstracts/clientErrorUI";
import PermissionEditDialog from "./PermissionEditDialog";
import DeletePermissionDialog from "./DeletePermissionDialog";
import TablePagination from "@/components/shared/TablePagination";
import { usePermissions } from "../hooks/usePermissions";
import Logger from "@/lib/Logger";

export default function PermissionLisitngs({
  hasPermission,
  setIsDialogOpen,
  startFetchPermissions,
  setStartFetchPermissions,
}) {
  // State for editing permission
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const handleEditClick = (permission) => {
    Logger.debug("Opening edit dialog for permission", { permissionId: permission.id });
    setSelectedPermission(permission);
    setIsEditDialogOpen(true);
  };

  const {
    data: permissions,
    totalItems,
    pageSize,
    sortBy,
    sortOrder,
    handleSort,
    showSkeleton,
    fetchError,
  } = usePermissions(startFetchPermissions, setStartFetchPermissions);
  
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

  if (fetchError)
    return <ClientErrorUI errorMessage={fetchError} retry={setStartFetchPermissions} />;

  return (
    <>
      {/* Edit Permission Dialog */}
      {selectedPermission && (
        <PermissionEditDialog
          isDialogOpen={isEditDialogOpen}
          setIsDialogOpen={setIsEditDialogOpen}
          setStartFetchPermissions={setStartFetchPermissions}
          permission={selectedPermission}
        />
      )}

      <section className="flex justify-between items-start mb-8 w-full max-h-14">
        <h1 className="text-3xl font-bold">Permissions</h1>
        <div className="ml-auto">
          <CreateButtonShared onClick={() => setIsDialogOpen(true)}>
            Create Permission
          </CreateButtonShared>
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
              <TableHead 
                className="w-[160px] px-6 py-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("scope")}
              >
                <div className="flex items-center">
                  Scope
                  {renderSortIcon("scope")}
                </div>
              </TableHead>
              <TableHead className="w-[480px] px-6 py-4">Description</TableHead>
              <TableHead className="w-[320px] text-center px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!hasPermission ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-lg text-center text-muted-foreground">
                  No Permissions found.
                </TableCell>
              </TableRow>
            ) : showSkeleton || permissions.length === 0 ? (
              <TableLoading />
            ) : (
              permissions.map((permission) => (
                <TableRow
                  key={permission.id}
                  className="transition-colors duration-200 hover:bg-muted"
                >
                  <TableCell className="px-6 py-5 text-base font-semibold">
                    {permission.name}
                  </TableCell>

                  <TableCell className="px-6 py-5 text-base font-semibold">
                    {permission.scope}
                  </TableCell>

                  <TableCell className="px-6 py-5 text-base text-muted-foreground">
                    {permission.description || (
                      <span className="text-sm italic text-gray-400">No description</span>
                    )}
                  </TableCell>

                  <TableCell className="flex gap-3 justify-center items-center px-6 py-5">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditClick(permission)}
                      className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 px-5 py-2.5 text-base cursor-pointer"
                    >
                      <Pencil className="mr-2 w-5 h-5 text-yellow-600" />
                      Edit
                    </Button>

                    <DeletePermissionDialog
                      permission={permission}
                      setStartFetchPermissions={setStartFetchPermissions}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {hasPermission && !showSkeleton && permissions.length > 0 && (
        <TablePagination
          totalItems={totalItems}
          itemsPerPage={pageSize}
          className="mb-8"
        />
      )}
    </>
  );
}
