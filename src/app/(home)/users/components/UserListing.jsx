"use client";

import ClientErrorUI from "@/components/abstracts/clientErrorUI";
import TableLoading from "@/components/loading/TableLoading";
import CreateButtonShared from "@/components/shared/CreateButtonShared";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Logger from "@/lib/Logger";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllUsersFn } from "../actions/getAllUsers";
import UserEditDrawer from "./UserEditDrawer";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { deleteUser } from "@/system/Actions/UserAction";

export default function UserLisitngs({ setIsDrawerOpen, shouldRefetch, setShouldRefetch }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const fetchUsers = async (isRefetch = false) => {
    if (isRefetch && !shouldRefetch) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllUsersFn();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
      if (isRefetch) {
        setShouldRefetch(false);
      }
    }
  };

  // Handle refetch when shouldRefetch changes
  useEffect(() => {
    if (shouldRefetch) {
      fetchUsers(true);
    }
  }, [shouldRefetch]);

  // Initial data fetch
  useEffect(() => {
    fetchUsers(false);
  }, []);

  const handleEditClick = (user) => {
    Logger.debug("Opening edit drawer for user", { userId: user.id });
    setSelectedUser(user);
    setIsEditDrawerOpen(true);
  };

  if (error) {
    return <ClientErrorUI errorMessage={error} retry={() => setShouldRefetch(true)} />;
  }

  return (
    <>
      <section className="flex items-start justify-between w-full mb-8 max-h-14">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="ml-auto">
          <CreateButtonShared onClick={() => setIsDrawerOpen(true)}>Create User</CreateButtonShared>
        </div>
      </section>
      <div className="overflow-auto border shadow-lg rounded-2xl bg-background">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="text-lg font-semibold tracking-wide">
              <TableHead className="w-[160px] px-6 py-4">Name</TableHead>
              <TableHead className="w-[160px] px-6 py-4">Email</TableHead>
              <TableHead className="w-[480px] px-6 py-4">Role</TableHead>
              <TableHead className="w-[160px] px-6 py-4">Is Active</TableHead>
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
                      <span className="text-sm text-muted-foreground">
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditClick(user)}
                        className="text-yellow-700 bg-yellow-50 hover:text-yellow-500 hover:bg-yellow-100 border border-yellow-200 px-5 py-2.5 text-base cursor-pointer"
                      >
                        <Pencil className="w-5 h-5 mr-2 text-yellow-600" />
                        Edit
                      </Button>

                      <DeleteConfirmationDialog
                        itemId={user.id}
                        itemName={user.username}
                        onDelete={deleteUser}
                        onSuccess={() => {
                          setIsEditDrawerOpen(false);
                          setShouldRefetch(true);
                        }}
                      />
                      
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Project Edit Drawer */}
        {selectedUser && (
          <UserEditDrawer
            isDrawerOpen={isEditDrawerOpen}
            setIsDrawerOpen={setIsEditDrawerOpen}
            user={selectedUser}
            onSuccess={() => {
              setIsEditDrawerOpen(false);
              setShouldRefetch(true);
            }}
          />
        )}
      </div>
    </>
  );
}
