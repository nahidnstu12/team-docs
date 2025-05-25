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
import { createSection } from "@/system/Actions/SectionActions";
import { useCallback, useMemo } from "react";

export default function CreateSectionDialog({
	project,
	isDialogOpen,
	setIsDialogOpen,
}) {
	const defaultValues = useMemo(
		() => ({
			name: "",
			description: "",
		}),
		[]
	);

	const successToast = useMemo(
		() => ({
			title: "Section created successfully",
			description: "Your new section is ready to use!",
		}),
		[]
	);

	const handleSuccess = useCallback(() => {
		setIsDialogOpen(false);
	}, [setIsDialogOpen]);

	const { register, errors, formAction, isPending, isSubmitDisabled } =
		useServerFormAction({
			schema: SectionSchema,
			actionFn: createSection,
			defaultValues,
			successToast,
			onSuccess: handleSuccess,
		});

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<div id="create-section-dialog-trigger" />
			</DialogTrigger>

			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">
						Create a New Section
					</DialogTitle>
					<DialogDescription>
						Provide a name and optional description for the new section in your
						project.
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} className="mt-6 space-y-5">
					<input type="hidden" name="projectId" value={project.id} />
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
							{isPending ? "Creating..." : "Create Section"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
