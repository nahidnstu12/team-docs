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
import { PageSchema } from "@/lib/schemas/PageSchema";
import { updatePageAction } from "@/system/Actions/PageSections";
import { useCallback, useMemo } from "react";

export default function PageEditDialog({ page, isDialogOpen, setIsDialogOpen }) {
  const defaultValues = useMemo(
    () => ({
      title: page?.title || "",
      description: page?.description || "",
    }),
    [page]
  );

  const successToast = useMemo(
    () => ({
      title: "Page updated successfully",
      description: "Your page has been updated!",
    }),
    []
  );

  const handleSuccess = useCallback(() => {
    setIsDialogOpen(false);
  }, [setIsDialogOpen]);

  const { register, errors, formAction, isPending, isSubmitDisabled } =
    useServerFormAction({
      schema: PageSchema,
      actionFn: (prevState, formData) => 
        updatePageAction(prevState, { 
          pageId: page?.id, 
          formData 
        }),
      defaultValues,
      successToast,
      onSuccess: handleSuccess,
    });

  if (!page) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div id="edit-page-dialog-trigger" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit Page
          </DialogTitle>
          <DialogDescription>
            Update the details of this page.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              placeholder="e.g. Getting Started, Advanced Usage etc."
              className="h-11"
              {...register("title")}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="What is this page about?"
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
              {isPending ? "Updating..." : "Update Page"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
