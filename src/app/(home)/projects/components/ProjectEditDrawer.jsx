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
import { updateProjectAction } from "@/system/Actions/ProjectActions";
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

export default function ProjectEditDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  setStartFetchProjects,
  project,
}) {
  const hasShownToastRef = useRef(false);

  const defaultValues = useMemo(
    () => ({
      name: project?.name || "",
      slug: project?.slug || "",
      description: project?.description || "",
    }),
    [project]
  );

  const form = useServerFormAction({
    schema: ProjectSchema,
    defaultValues,
    actionFn: (formData) => updateProjectAction(project.id, formData),
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
      title: "Project updated successfully",
      description: "Your project has been updated successfully.",
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
    if (isDrawerOpen && project) {
      form.reset({
        name: project.name,
        slug: project.slug,
        description: project.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen, form.reset, project]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent
        side="right"
        className="w-full max-w-md min-h-screen h-screen ml-auto border-l shadow-xl"
      >
        <Form {...form}>
          <form onSubmit={form.onSubmit} className="flex flex-col h-full justify-between">
            <DrawerHeader className="ml-2">
              <DrawerTitle className="text-3xl">Edit Project</DrawerTitle>
              <DrawerDescription className="pl-1">
                Update your project information.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-col flex-1 px-6 py-4 space-y-6 overflow-y-auto mt-auto h-full">
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
                        className="px-4 py-2 w-full rounded-md border border-gray-200"
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
                        placeholder="Describe your project's purpose..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GeneralFormErrorDispaly form={form} />
            </div>

            <DrawerFooter className="border-t mt-auto">
              <DrawerClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" disabled={!slugValue || form.isSubmitDisabled}>
                {form.formState.isSubmitting ? "Updating..." : "Update Project"}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
