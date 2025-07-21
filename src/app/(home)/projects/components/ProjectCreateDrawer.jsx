"use client";

import { useEffect, useMemo, useRef } from "react";
import slugify from "slugify";

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
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { createProjectAction } from "@/system/Actions/ProjectActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";

export default function ProjectDrawer({ isDrawerOpen, setIsDrawerOpen, setStartFetchProjects }) {
  const hasShownToastRef = useRef(false);

  const defaultValues = useMemo(
    () => ({
      name: "",
      slug: "",
      description: "",
    }),
    []
  );

  const form = useServerFormAction({
    schema: ProjectSchema,
    defaultValues,
    actionFn: createProjectAction,
    onSuccess: () => {
      if (hasShownToastRef.current) return;
      hasShownToastRef.current = true;

      form.reset();
      setIsDrawerOpen(false);
      setStartFetchProjects(true);

      setTimeout(() => {
        hasShownToastRef.current = false;
      }, 500);
    },
    isDrawerOpen,
    successToast: {
      title: "Project created successfully",
      description: "Your new project is ready to use!",
    },
  });

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  useEffect(() => {
    if (!isDrawerOpen || !nameValue) return;
    form.setValue(
      "slug",
      slugify(nameValue, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue, form.setValue, isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen, form.reset, defaultValues]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent
        side="right"
        className="w-full max-w-md min-h-screen h-screen ml-auto border-l shadow-xl"
      >
        <Form {...form}>
          <form onSubmit={form.onSubmit} className="flex flex-col h-full justify-between">
            <DrawerHeader className="ml-2">
              <DrawerTitle className="text-3xl">Create New Project</DrawerTitle>
              <DrawerDescription className="pl-1">
                Start a new project to manage pages.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col flex-1 px-6 py-4 space-y-6 overflow-y-auto mt-auto h-full">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Internal CRM" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        className="w-full px-4 py-2 text-gray-500 bg-gray-100 border border-gray-200 rounded-md"
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe your project’s purpose..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GeneralFormErrorDispaly form={form} />

              <DrawerFooter className="border-t mt-auto">
                <DrawerClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit" disabled={!slugValue || form.isSubmitDisabled}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </DrawerFooter>
            </div>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
