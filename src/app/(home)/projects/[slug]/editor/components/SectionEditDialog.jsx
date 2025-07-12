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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { SectionSchema } from "@/lib/schemas/SectionSchema";
import { updateSectionAction } from "@/system/Actions/SectionActions";
import { useCallback, useMemo } from "react";

export default function SectionEditDialog({ section, isDialogOpen, setIsDialogOpen }) {
  const defaultValues = useMemo(
    () => ({
      name: section?.name || "",
      description: section?.description || "",
    }),
    [section]
  );

  const successToast = useMemo(
    () => ({
      title: "Section updated successfully",
      description: "Your section has been updated!",
    }),
    []
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

  const { register, errors, formAction, isPending, isSubmitDisabled } =
    useServerFormAction({
      schema: SectionSchema,
      actionFn: (prevState, formData) => 
        updateSectionAction(prevState, { 
          sectionId: section?.id, 
          formData 
        }),
      defaultValues,
      successToast,
      onSuccess: handleSuccess,
    });

  if (!section) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div id="edit-section-dialog-trigger" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit Section
          </DialogTitle>
          <DialogDescription>
            Update the details of this section.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Section Name</Label>
            <Input
              id="name"
              placeholder="e.g. Introductions, Getting Started etc"
              className="h-11"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="What is this section about?"
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
              {isPending ? "Updating..." : "Update Section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
