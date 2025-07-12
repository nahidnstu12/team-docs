"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateRoleAction } from "@/system/Actions/RoleActions";
import { RoleSchema } from "@/lib/schemas/RoleSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { useCallback, useEffect, useMemo } from "react";
import Logger from "@/lib/Logger";

export default function RoleEditDialog({
  isDialogOpen,
  setIsDialogOpen,
  setShouldStartFetchRoles,
  role,
}) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: role?.name || "",
      description: role?.description || "",
    }),
    [role]
  );

  const successToast = useMemo(
    () => ({
      title: "Role updated successfully",
      description: "The role changes have been saved.",
    }),
    []
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
    setShouldStartFetchRoles(true);
  }, [setIsDialogOpen, setShouldStartFetchRoles]);

  const { 
    register, 
    errors, 
    formAction, 
    isPending, 
    isSubmitDisabled, 
    reset 
  } = useServerFormAction({
    schema: RoleSchema,
    actionFn: (prevState, formData) => 
      updateRoleAction(prevState, { 
        roleId: role.id, 
        formData 
      }),
    defaultValues,
    successToast,
    onSuccess: handleSuccess,
    isDialogOpen,
  });

  useEffect(() => {
    if (isDialogOpen && role) {
      Logger.debug("Populating edit form with role data", role);
      reset({
        name: role.name,
        description: role.description || "",
      });
    }
  }, [isDialogOpen, reset, role]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div id="edit-role-dialog-trigger" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Edit Role
            </DialogTitle>
            <DialogDescription>
              Update the information for this role.
            </DialogDescription>
          </DialogHeader>

          <form action={formAction} className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                placeholder="e.g. Admin, Editor, Moderator"
                className="h-11"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="What is this role about?"
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {errors._form && (
              <div className="p-4 mb-4 border-l-4 border-red-500 bg-red-50">
                <p className="text-red-700">{errors._form.message}</p>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitDisabled}>
                {isPending ? "Updating..." : "Update Role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
