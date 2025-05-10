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
    developer, 
    projectId,
    onSuccess 
}) {
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const allPermissions = await getProjectPermission("school-demo");
                setPermissions(allPermissions);
                
                // Set initial selected permissions from developer's current permissions
                if (developer?.projectPermissions) {
                    setSelectedPermissions(
                        developer.projectPermissions.map(p => p.permission.id)
                    );
                }
            } catch (error) {
                console.error("Failed to fetch permissions:", error);
            }
        };

        if (isOpen) {
            fetchPermissions();
        }
    }, [isOpen, developer]);

    const handlePermissionChange = (permissionId, checked) => {
        setSelectedPermissions(prev =>
            checked
                ? [...prev, permissionId]
                : prev.filter(id => id !== permissionId)
        );
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            console.log({selectedPermissions, developer: developer.id, projectId}, "selectedPermissions");
            const result = await modifyDevPermissionsAction({
                selectedUser: developer.id,
                projectId,
                selectedPermissions
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
                        <DrawerDescription>
                            Modify permissions for {developer?.username}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        <div className="space-y-4">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`permission-${permission.id}`}
                                        checked={selectedPermissions.includes(permission.id)}
                                        onCheckedChange={(checked) => 
                                            handlePermissionChange(permission.id, checked)
                                        }
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
                        <Button 
                            onClick={handleSave} 
                            disabled={isLoading}
                        >
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