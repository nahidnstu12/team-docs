"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
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

export default function WorkspaceForm() {
	const router = useRouter();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formState, formAction, isPending] = useActionState(createWorkspace, {
		errors: null,
		data: null,
	});

	const form = useForm({
		resolver: zodResolver(WorkspaceSchema),
		defaultValues: {
			name: "",
			slug: "",
			description: "",
		},
	});

	const {
		register,
		setError,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = form;

	// Watch name field and update slug
	const nameValue = watch("name");
	useEffect(() => {
		if (nameValue) {
			const slug = slugify(nameValue, {
				lower: true,
				strict: true,
				remove: /[*+~.()'"!:@]/g,
			});
			setValue("slug", slug);
		} else {
			setValue("slug", "");
		}
	}, [nameValue, setValue]);

	// watch slug value
	const slugValue = watch("slug");

	useEffect(() => {
		if (!formState) return;

		if (formState.errors) {
			// Set field errors
			Object.entries(formState.errors).forEach(([field, messages]) => {
				setError(field, {
					type: "server",
					message: Array.isArray(messages) ? messages[0] : messages,
				});

				if (field === "_form") {
					toast.error(messages[0]);
				}
			});

			// Only reset with values if this is NOT coming after a success
			if (formState.data) {
				reset(formState.data, {
					keepErrors: true,
				});
			}
		}

		if (formState.type === "success") {
			setIsDialogOpen(false);
			reset();

			toast.success("Workspace created successfully", {
				description: "Your new workspace is ready to use!",
			});

			if (formState.redirectTo) {
				router.push(formState.redirectTo);
			}
		}
	}, [formState, setError, reset, router]);

	// Reset everything when dialog opens
	useEffect(() => {
		if (isDialogOpen) {
			reset();
		}
	}, [isDialogOpen, reset]);
	return (
		<div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
			<h1 className="text-4xl font-bold tracking-tight">No workspace found</h1>
			<p className="max-w-md text-muted-foreground">
				You haven’t created any workspaces yet. Workspaces help you organize
				your projects, tasks, and teams in one place.
			</p>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogTrigger asChild>
					<Button size="lg" onClick={() => setIsDialogOpen(true)}>
						Create Your First Workspace
					</Button>
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
						<div>
							<Label htmlFor="name" className="block mb-1 text-left">
								Workspace Name
							</Label>
							<Input
								id="name"
								placeholder="e.g. Product Design, Marketing Team"
								className="h-11"
								{...register("name")}
								aria-invalid={!!errors.name}
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-500">
									{errors.name.message}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="slug" className="block mb-1 text-left">
								Workspace URL
							</Label>
							<Input
								id="slug"
								className="h-11 bg-muted"
								readOnly
								{...register("slug")}
								aria-invalid={!!errors.slug}
							/>
							<p className="mt-1 text-xs text-muted-foreground">
								This will be your workspace&apos;s unique URL
							</p>
							{errors.slug && (
								<p className="mt-1 text-sm text-red-500">
									{errors.slug.message}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="description" className="block mb-1 text-left">
								Description{" "}
								<span className="text-muted-foreground">(optional)</span>
							</Label>
							<Textarea
								id="description"
								placeholder="What is this workspace about?"
								{...register("description")}
								aria-invalid={!!errors.description}
							/>
							{errors.description && (
								<p className="mt-1 text-sm text-red-500">
									{errors.description.message}
								</p>
							)}
						</div>

						{/* General form error placeholder */}
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
		</div>
	);
}
