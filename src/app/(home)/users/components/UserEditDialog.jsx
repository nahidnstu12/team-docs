"use client";

import { useCallback, useEffect, useMemo } from "react";

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
import { AdminUpdatingUser } from "@/system/Actions/UserAction";
import { AdminUpdatingUserSchema } from "@/lib/schemas/UserSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userStatus = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "INACTIVE", label: "Inactive" },
];

export default function UserEditDialog({ isDialogOpen, setIsDialogOpen, setShouldRefetch, user }) {
  const defaultValues = useMemo(
    () => ({
      status: user?.status,
    }),
    [user]
  );

  const successToast = useMemo(
    () => ({
      title: "User updated successfully",
      description: "The user changes have been saved.",
    }),
    []
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
    setShouldRefetch(true);
  }, [setIsDialogOpen, setShouldRefetch]);

  const { errors, formAction, isPending, isSubmitDisabled, reset, control } = useServerFormAction({
    schema: AdminUpdatingUserSchema,
    actionFn: AdminUpdatingUser,
    defaultValues,
    successToast,
    onSuccess: handleSuccess,
    isDialogOpen,
  });

  useEffect(() => {
    if (isDialogOpen && user) {
      reset({
        status: user?.status,
      });
    }
  }, [isDialogOpen, reset, user]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div id="edit-user-dialog-trigger" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit User</DialogTitle>
            <DialogDescription>Update the information for this user.</DialogDescription>
          </DialogHeader>

          <form action={formAction} className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-1/2 mt-2">
                      <SelectValue placeholder="User Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {userStatus.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            {errors._form && (
              <div className="p-4 mb-4 border-l-4 border-red-500 bg-red-50">
                <p className="text-red-700">{errors._form.message}</p>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitDisabled}>
                {isPending ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
