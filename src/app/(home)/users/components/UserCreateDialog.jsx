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
import { Input } from "@/components/ui/input";
import { createUser } from "@/system/Actions/UserAction";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";

export default function UserCreateDialog({ isDialogOpen, setIsDialogOpen, onSuccess }) {
  const defaultValues = useMemo(
    () => ({
      username: "",
      email: "",
      password: "",
    }),
    []
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
    onSuccess(true);
  }, [setIsDialogOpen, onSuccess]);

  const form = useServerFormAction({
    schema: UserSchema,
    defaultValues,
    actionFn: createUser,
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "User created successfully",
      description: "Your new user is ready to use!",
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
            <DialogTitle className="text-2xl font-semibold">Create a New User</DialogTitle>
            <DialogDescription>
              Provide a username, email and password for the new user in your system.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.onSubmit} className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. johndoe" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. johndoe@example.com" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. password123" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GeneralFormErrorDispaly form={form} />

              <DialogFooter className="pt-4">
                <Button type="submit" disabled={form.isSubmitDisabled}>
                  {form.formState.isSubmitting ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
