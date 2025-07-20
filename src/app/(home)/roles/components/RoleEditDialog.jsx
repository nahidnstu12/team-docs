"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { updateRoleAction } from "@/system/Actions/RoleActions";
import { RoleSchema } from "@/lib/schemas/RoleSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { useCallback, useMemo } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";

export default function RoleEditDialog({
  isDialogOpen,
  setIsDialogOpen,
  setShouldStartFetchRoles,
  role,
}) {
  const defaultValues = useMemo(
    () => ({
      name: role?.name || "",
      description: role?.description || "",
    }),
    [role]
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
    setShouldStartFetchRoles(true);
  }, [setIsDialogOpen, setShouldStartFetchRoles]);

  const form = useServerFormAction({
    schema: RoleSchema,
    defaultValues,
    actionFn: (formData) =>
      updateRoleAction({
        roleId: role.id,
        formData,
      }),
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "Role updated successfully",
      description: "The role changes have been saved.",
    },
  });

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div id="edit-role-dialog-trigger" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Role</DialogTitle>
            <DialogDescription>Update the information for this role.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.onSubmit} className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Admin, Editor, Moderator"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="What is this role about?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GeneralFormErrorDispaly form={form} />

              <DialogFooter className="pt-4">
                <Button type="submit" disabled={form.isSubmitDisabled}>
                  {form.formState.isSubmitting ? "Updating..." : "Update Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
