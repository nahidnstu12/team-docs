"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { createWorkspace } from "@/system/Actions/WorkspaceAction";
import { toast } from "sonner";
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

export default function WorkspaceForm({ isOpen, onOpenChange }) {
	const router = useRouter();

	const [formState, formAction, isPending] = useActionState(createWorkspace, {
		errors: null,
		data: null,
	});

	const {
		register,
		setError,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(WorkspaceSchema),
		defaultValues: {
			name: "",
			slug: "",
			description: "",
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
		if (isOpen) reset();
	}, [isOpen, reset]);

	// Handle form state & success
	useEffect(() => {
		if (!formState) return;

		if (formState.errors) {
			Object.entries(formState.errors).forEach(([field, message]) => {
				setError(field, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});
				if (field === "_form") toast.error(message[0]);
			});
			if (formState.data) {
				reset(formState.data, { keepErrors: true });
			}
		}

		if (formState.type === "success") {
			onOpenChange(false);
			reset();
			toast.success("Workspace created successfully", {
				description: "Your new workspace is ready to use!",
			});
			if (formState.redirectTo) {
				router.push(formState.redirectTo);
			}
		}
	}, [formState, setError, reset, router, onOpenChange]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				{/* Hidden trigger: triggered by card manually */}
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
