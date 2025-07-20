"use client";

import { useCallback, useMemo } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";

const userStatus = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "INACTIVE", label: "Inactive" },
];

export default function UserEditDialog({ isDialogOpen, setIsDialogOpen, setShouldRefetch, user }) {
  const defaultValues = useMemo(
    () => ({
      status: user?.status,
      id: user?.id,
    }),
    [user]
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
    setShouldRefetch(true);
  }, [setIsDialogOpen, setShouldRefetch]);

  const form = useServerFormAction({
    schema: AdminUpdatingUserSchema,
    defaultValues,
    actionFn: AdminUpdatingUser,
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "User updated successfully",
      description: "The user changes have been saved.",
    },
  });

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

          <Form {...form}>
            <form onSubmit={form.onSubmit} className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-1/2 mt-2">
                          <SelectValue placeholder="User Status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {userStatus.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />

              <input hidden defaultValue={user?.id} {...form.register("id")} />

              <GeneralFormErrorDispaly form={form} />

              <DialogFooter className="pt-4">
                <Button type="submit" disabled={form.isSubmitDisabled}>
                  {form.formState.isSubmitting ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
