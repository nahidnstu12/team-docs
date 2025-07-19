"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import TableLoading from "@/components/loading/TableLoading";
import { useUsers } from "../hooks/useUsers";
import TablePagination from "@/components/shared/TablePagination";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import UserDeleteDialog from "./UserDeleteDialog";
import { useState } from "react";
import UserEditDialog from "./UserEditDialog";

export default function UserListings({ setIsDialogOpen, shouldRefetch, setShouldRefetch }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUserEdit, setSelectedUserEdit] = useState(null);
  const {
    data: users,
    totalItems,
    pageSize,
    sortBy,
    sortOrder,
    handleSort,
    showSkeleton: isLoading,
  } = useUsers(shouldRefetch, setShouldRefetch);

  const handleEditClick = (user) => {
    setSelectedUserEdit(user);
    setIsEditDialogOpen(true);
  };

  // Function to render sort indicator icons
  // extract this into re-usable components
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

  return (
    <>
      {/* Edit Permission Dialog */}
      {isEditDialogOpen && selectedUserEdit && (
        <UserEditDialog
          isDialogOpen={isEditDialogOpen}
          setIsDialogOpen={setIsEditDialogOpen}
          setShouldRefetch={setShouldRefetch}
          user={selectedUserEdit}
        />
      )}

      <section className="flex items-start justify-between w-full mb-8 max-h-14">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="ml-auto">
          <CreateButtonShared onClick={() => setIsDialogOpen(true)}>Create User</CreateButtonShared>
        </div>
      </section>
      <div className="overflow-auto border shadow-lg rounded-2xl bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="text-lg font-semibold tracking-wide">
              <TableHead
                className="w-[160px] px-6 py-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("username")}
              >
                <div className="flex items-center">
                  Name
                  {renderSortIcon("username")}
                </div>
              </TableHead>
              <TableHead
                className="w-[160px] px-6 py-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Email
                  {renderSortIcon("email")}
                </div>
              </TableHead>
              <TableHead className="w-[480px] px-6 py-4">Role</TableHead>
              <TableHead className="w-[320px] text-center px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableLoading />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-lg text-center text-muted-foreground">
                  No Users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="transition-colors duration-200 hover:bg-muted">
                  <TableCell className="px-6 py-5 text-base font-semibold">
                    {user.username}
                  </TableCell>

                  <TableCell className="px-6 py-5 text-base font-semibold">{user.email}</TableCell>

                  <TableCell className="px-6 py-5 text-base text-muted-foreground">
                    {user.role}
                  </TableCell>

                  <TableCell className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditClick(user)}
                        className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 px-5 py-2.5 text-base cursor-pointer"
                      >
                        <Pencil className="mr-2 w-5 h-5 text-yellow-600" />
                        Edit
                      </Button>

                      <UserDeleteDialog user={user} setShouldRefetch={setShouldRefetch} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {users.length > 0 && (
        <TablePagination totalItems={totalItems} itemsPerPage={pageSize} className="mt-6 mb-8" />
      )}
    </>
  );
}
