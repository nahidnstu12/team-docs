"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { createWorkspace } from "@/system/Actions/WorkspaceAction";
import slugify from "slugify";

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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerFormAction } from "@/hooks/useServerFormAction";

export default function WorkspaceForm({ isDrawerOpen, setIsDrawerOpen }) {
	const router = useRouter();

	const defaultValues = useMemo(
		() => ({
			name: "",
			slug: "",
			description: "",
		}),
		[]
	);

	const successToast = useMemo(
		() => ({
			title: "Workspace created successfully",
			description: "Your new workspace is ready to use!",
		}),
		[]
	);

	// Use the custom server form action hook
	const { register, reset, watch, setValue, formAction, isPending, errors } =
		useServerFormAction({
			schema: WorkspaceSchema,
			actionFn: createWorkspace,
			defaultValues,
			successToast,
			onSuccess: (redirectTo) => {
				// Handle form submission success
				setIsDrawerOpen(false);
				reset(); // Reset form fields
				router.push(redirectTo); // Redirect after success
			},
			onError: () => {
				// Handle error if needed (formState will display server errors automatically)
			},
		});

	const nameValue = watch("name");
	const slugValue = watch("slug");

	// Slug auto-generation
	useEffect(() => {
		if (nameValue) {
			setValue(
				"slug",
				slugify(nameValue, {
					lower: true,
					strict: true,
					remove: /[*+~.()'"!:@]/g,
				})
			);
		} else {
			setValue("slug", "");
		}
	}, [nameValue, setValue]);

	// Reset on open
	useEffect(() => {
		if (isDrawerOpen) reset();
	}, [isDrawerOpen, reset]);

	// 🩹 When dialog opens and form had errors: repopulate values and restore error messages
	// useEffect(() => {
	// 	if (!isDrawerOpen || formState?.type === "success") return;

	// 	// Step 1: Reset values to last attempted input
	// 	reset(formState.data || {}, { keepErrors: true });

	// 	// Step 2: Re-apply server errors
	// 	Object.entries(formState.errors).forEach(([field, message]) => {
	// 		setError(field, {
	// 			type: "server",
	// 			message: Array.isArray(message) ? message[0] : message,
	// 		});
	// 	});
	// }, [isDrawerOpen, formState, reset, setError]);

	return (
		<Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
			<DialogTrigger asChild>
				{/* Hidden trigger */}
				<div id="create-workspace-drawer-trigger" />
			</DialogTrigger>

			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">
						Create a New Workspace
					</DialogTitle>
					<DialogDescription>
						Give your workspace a clear name and a short description so your
						team knows what it&apos;s for.
					</DialogDescription>
				</DialogHeader>

				<form action={formAction} className="mt-6 space-y-5">
					{/* Workspace Name */}
					<div className="space-y-1.5">
						<Label htmlFor="name">Workspace Name</Label>
						<Input
							id="name"
							placeholder="e.g. Product Design, Marketing Team"
							className="h-11"
							{...register("name")}
						/>
						{errors.name && (
							<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					{/* Workspace Slug */}
					<div className="space-y-1.5">
						<Label htmlFor="slug">Workspace URL</Label>
						<Input
							id="slug"
							className="h-11 bg-muted"
							readOnly
							{...register("slug")}
						/>
						<p className="mt-1 text-xs text-muted-foreground">
							This will be your workspace&apos;s unique URL
						</p>
						{errors.slug && (
							<p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
						)}
					</div>

					{/* Workspace Description */}
					<div className="space-y-1.5">
						<Label htmlFor="description">
							Description{" "}
							<span className="text-muted-foreground">(optional)</span>
						</Label>
						<Textarea
							id="description"
							placeholder="What is this workspace about?"
							{...register("description")}
						/>
						{errors.description && (
							<p className="mt-1 text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Global Error */}
					{errors._form && (
						<div className="p-4 mb-4 border-l-4 border-red-500 bg-red-50">
							<p className="text-red-700">{errors._form.message}</p>
						</div>
					)}

					<DialogFooter className="pt-4">
						<Button type="submit" disabled={!slugValue || isPending}>
							{isPending ? "Creating..." : "Create Workspace"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
