"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getProjectPermission } from "../actions/getProjectPermission";
import { modifyDevPermissionsAction } from "@/system/Actions/ProjectPermissionAction";

export default function ModifyPermissionsDrawer({
  isOpen,
  onClose,
  memberAndPermissions,
  projectId,
  onSuccess,
  projectName,
}) {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, permissions: memberPermissions } = memberAndPermissions ?? {};

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const allPermissions = await getProjectPermission(projectName);
        setPermissions(allPermissions);

        // Set initial selected permissions from developer's current permissions
        if (memberPermissions) {
          setSelectedPermissions(memberPermissions.map((p) => p.id));
        }
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    };

    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen, memberAndPermissions, projectName, memberPermissions]);

  const handlePermissionChange = (permissionId, checked) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, permissionId] : prev.filter((id) => id !== permissionId)
    );
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const result = await modifyDevPermissionsAction({
        selectedUser: user.id,
        projectId,
        selectedPermissions,
      });

      if (result.success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Failed to modify permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Modify Permissions</DrawerTitle>
            <DrawerDescription>Modify permissions for {user?.username}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="space-y-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                  />
                  <label
                    htmlFor={`permission-${permission.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
