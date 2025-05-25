"use client";

import { useEffect, useMemo, useRef } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { useServerFormAction } from "@/hooks/useServerFormAction";
import { updateUser } from "@/system/Actions/UserAction";
import { useDrawerLoadingStore } from "@/lib/stores/useDrawerLoadingStore";
import Logger from "@/lib/Logger";
import { Checkbox } from "@/components/ui/checkbox";
import { UserSchema } from "@/lib/schemas/UserSchema";

export default function UserEditDrawer({ isDrawerOpen, setIsDrawerOpen, user, onSuccess }) {
  const router = useRouter();

  Logger.debug("UserEditDrawer", JSON.stringify(user, null, 2));

  // animate drawer loading spinner
  useEffect(() => {
    useDrawerLoadingStore.getState().markDrawerReady();
  }, []);

  const hasShownToastRef = useRef(false);

  const defaultValues = useMemo(
    () => ({
      username: user?.username || "",
      email: user?.email || "",
      isActive: user?.isActive || true,
    }),
    [user]
  );

  const { register, watch, setValue, reset, errors, formAction, isPending, isSubmitDisabled } =
    useServerFormAction({
      schema: UserSchema,
      actionFn: (prevState, formData) =>
        updateUser(prevState, {
          userId: user.id,
          formData,
        }),
      defaultValues,
      onSuccess: () => {
        if (hasShownToastRef.current) return;
        hasShownToastRef.current = true;

        reset();
        setIsDrawerOpen(false);
        onSuccess();
        router.refresh();

        setTimeout(() => {
          hasShownToastRef.current = false;
        }, 500);

        // clean up drawer loading spinner state
        useDrawerLoadingStore.getState().resetDrawerLoading();
      },
      successToast: {
        title: "User updated",
        description: "Your user has been updated successfully.",
      },
    });

  console.log("usererror", errors);

  const usernameValue = watch("username");
  const emailValue = watch("email");

  useEffect(() => {
    if (isDrawerOpen && user) {
      // Logger.debug("Populating edit form with user data", user);
      reset({
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      });
      // clean up drawer loading spinner state
      useDrawerLoadingStore.getState().resetDrawerLoading();
    }
  }, [isDrawerOpen, reset, user]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent
        side="right"
        className="ml-auto w-full max-w-md min-h-screen border-l shadow-xl"
      >
        <form action={formAction} className="flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle>Edit User</DrawerTitle>
            <DrawerDescription>Update your user information.</DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
            {/* Name Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">User Name</label>
              <input
                {...register("username")}
                placeholder="E.g. John Doe"
                aria-invalid={!!errors.username}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                className="px-4 py-2 w-full rounded-md border border-gray-200"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* TODO: ROLE ASSIGN FOR USER */}

            {/* isActive Field */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={watch("isActive")}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <label htmlFor="isActive" className="block mb-1 text-sm font-medium text-gray-700">
                Is Active
              </label>

              {errors.isActive && (
                <p className="mt-1 text-sm text-red-500">{errors.isActive.message}</p>
              )}
            </div>

            {/* Global Form Error */}
            {errors._form && (
              <div className="p-2 bg-red-50 border-l-2 border-red-500">
                <p className="text-sm text-red-700">{errors._form.message}</p>
              </div>
            )}
          </div>

          <DrawerFooter className="flex gap-3 justify-end px-6 py-4 border-t">
            <DrawerClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DrawerClose>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isPending ? "Updating..." : "Update User"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
