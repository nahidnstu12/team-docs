"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getMembers } from "../actions/getMembers";
import { getProjectPermission } from "../actions/getProjectPermission";
import { assignDevAction } from "@/system/Actions/ProjectPermissionAction";

export default function AssignDevHeader({ projectName, workspaceId, onAssignSuccess, projectId }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const members = await getMembers(workspaceId, projectId);
      setMembers(members);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissions = await getProjectPermission(projectName);
        setPermissions(permissions);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };
    fetchPermissions();
  }, [projectName]);

  // Filter users by name or email (searching)
  const filteredMembers =
    members?.length > 0
      ? members?.filter((member) =>
          `${member.username} ${member.email}`.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  // Toggle selection
  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handlePermissionChange = (permissionId, checked) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, permissionId] : prev.filter((id) => id !== permissionId)
    );
  };

  const handleAssign = async () => {
    try {
      setIsAssigning(true);
      const result = await assignDevAction({
        selectedPermissions,
        selectedUsers,
        projectId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Clear selections after successful assignment
      setSelectedUsers([]);
      setSelectedPermissions([]);
      setSearch("");

      // Refetch the developer list
      await fetchMembers();

      // Notify parent component about successful assignment
      if (onAssignSuccess) {
        onAssignSuccess();
      }

      // You can add a toast notification here if you want
    } catch (error) {
      console.error("Failed to assign developers:", error.message);
      // You can add error toast notification here
    } finally {
      setIsAssigning(false);
    }
  };

  // Get selected user names for display
  const getSelectedUserNames = () => {
    if (selectedUsers.length === 0) return "Select Dev's";
    const selectedUserObjects = members.filter((member) => selectedUsers.includes(member.id));
    return `${selectedUserObjects.length} Developer${
      selectedUserObjects.length > 1 ? "s" : ""
    } selected`;
  };

  // Get selected permission names for display
  const getSelectedPermissionNames = () => {
    if (selectedPermissions.length === 0) return "Project Permission";
    const selectedPermissionObjects = permissions.filter((permission) =>
      selectedPermissions.includes(permission.id)
    );
    return `${selectedPermissionObjects.length} Permission${
      selectedPermissionObjects.length > 1 ? "s" : ""
    } selected`;
  };

  return (
    <div className="">
      <section className="flex justify-between gap-4 py-6 my-6  bg-gray-100">
        <div className="flex gap-4 w-[80%] justify-between px-4">
          {/* left */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-96" disabled={isLoading}>
                {isLoading ? "Loading..." : getSelectedUserNames()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 max-h-[400px] overflow-y-auto">
              <DropdownMenuLabel className="flex flex-col gap-2">
                <span className="text-base font-medium">Select Developer&apos;s</span>
                <Input
                  placeholder="Search name or email..."
                  className="h-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">Loading developers...</div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No developers Found...</div>
              ) : (
                filteredMembers.map((member) => (
                  <DropdownMenuCheckboxItem
                    key={member.id}
                    checked={selectedUsers.includes(member.id)}
                    onCheckedChange={() => toggleUser(member.id)}
                    onSelect={(e) => e.preventDefault()}
                    className="py-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold">{member.username}</span>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-96" disabled={isLoading}>
                {getSelectedPermissionNames()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96">
              {permissions?.map((permission) => (
                <DropdownMenuCheckboxItem
                  key={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {permission.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-[20%] flex justify-center">
          <Button
            onClick={handleAssign}
            disabled={isAssigning || selectedUsers.length === 0 || selectedPermissions.length === 0}
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </section>
    </div>
  );
}
