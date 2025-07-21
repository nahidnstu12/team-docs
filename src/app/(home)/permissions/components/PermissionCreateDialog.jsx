"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPermissions } from "@/system/Actions/PermissionActions";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { getAllProjectsFn } from "./../actions/getAllProjects";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GeneralFormErrorDispaly from "@/components/shared/GeneralFormErrorDispaly";

export default function PermissionCreateDialog({
  isDialogOpen,
  setIsDialogOpen,
  setStartFetchPermissions,
}) {
  const [permissionScopeStatus, setPermissionScopeStatus] = useState("general");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getAllProjectsFn().then((res) => {
      setProjects(res);
    });
  }, []);

  const defaultValues = useMemo(() => {
    return {
      name: "",
      description: "",
      scope: "",
    };
  }, []);

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
    setStartFetchPermissions(true);
  }, [setIsDialogOpen, setStartFetchPermissions]);

  const form = useServerFormAction({
    schema: PermissionSchema,
    defaultValues,
    actionFn: createPermissions,
    onSuccess: handleSuccess,
    isDialogOpen,
    successToast: {
      title: "Permission created successfully",
      description: "Your new permission is ready to use!",
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
            <DialogTitle className="text-2xl font-semibold">Create a New Permission</DialogTitle>
            <DialogDescription>
              Provide a name and optional description for the new permission in your system.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.onSubmit} className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. create, update, delete, view"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-1.5">
                <Label htmlFor="scope">Permission Scope</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={permissionScopeStatus === "general" ? "px-6 bg-gray-200" : ""}
                    onClick={() => setPermissionScopeStatus("general")}
                  >
                    General
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={permissionScopeStatus === "project" ? "px-6 bg-gray-200" : ""}
                    onClick={() => setPermissionScopeStatus("project")}
                  >
                    Project Scope Permission
                  </Button>
                </div>
                {permissionScopeStatus === "general" ? (
                  <Input
                    id="scope"
                    placeholder="Create your general permission"
                    className="h-11 mt-2"
                    {...form.register("scope")}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="scope"
                    render={({ field }) => (
                      <FormItem>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-1/2 mt-2 h-11">
                              <SelectValue placeholder="User Status" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.name}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                          <FormMessage />
                        </Select>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="What is this permission about?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GeneralFormErrorDispaly form={form} />

              <DialogFooter className="pt-4">
                <Button type="submit" disabled={form.isSubmitDisabled}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Permission"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
