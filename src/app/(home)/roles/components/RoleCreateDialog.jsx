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
import { createRole } from "@/system/Actions/RoleActions";
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

export default function RoleCreateDrawer({
  isDialogOpen,
  setIsDialogOpen,
  setShouldStartFetchRoles,
}) {
  const defaultValues = useMemo(
    () => ({
      name: "",
      description: "",
    }),
    []
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
    setShouldStartFetchRoles(true);
  }, [setIsDialogOpen, setShouldStartFetchRoles]);

  const form = useServerFormAction({
    schema: RoleSchema,
    defaultValues,
    actionFn: createRole,
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "Role created successfully",
      description: "Your new role is ready to use!",
    },
  });

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div id="create-role-drawer-trigger" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Create a New Role</DialogTitle>
            <DialogDescription>
              Provide a name and optional description for the new role in your system.
            </DialogDescription>
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
                  {form.formState.isSubmitting ? "Creating..." : "Create Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
