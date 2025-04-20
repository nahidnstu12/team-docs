"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useMemo, useState } from "react";

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
import { useRouter } from "next/navigation";
import { WorkspaceSchema } from "@/lib/schemas/workspaceSchema";
import { createWorkspace } from "@/system/Actions/WorkspaceAction";

export default function WorkspacePage() {
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
			description: "",
		},
	});

	const {
		register,
		setError,
		reset,
		formState: { errors },
	} = form;

	useEffect(() => {
		if (!formState) return;

		if (formState.errors) {
			// Set field errors
			Object.entries(formState.errors).forEach(([field, messages]) => {
				setError(field, {
					type: "server",
					message: Array.isArray(messages) ? messages[0] : messages,
				});
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
			reset(); // Completely reset form

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
			<p className="text-muted-foreground max-w-md">
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

					<form action={formAction} className="space-y-5 mt-6">
						<div>
							<Label htmlFor="name" className="mb-1 block text-left">
								Workspace Name
							</Label>
							<Input
								id="name"
								placeholder="e.g. Product Design, Marketing Team"
								className="h-11"
								{...register("name")}
							/>
							{errors.name && (
								<p className="text-sm text-red-500 mt-1">
									{errors.name.message}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="description" className="mb-1 block text-left">
								Description{" "}
								<span className="text-muted-foreground">(optional)</span>
							</Label>
							<Textarea
								id="description"
								placeholder="What is this workspace about?"
								{...register("description")}
							/>
							{errors.description && (
								<p className="text-sm text-red-500 mt-1">
									{errors.description.message}
								</p>
							)}
						</div>

						<DialogFooter className="pt-4">
							<Button type="submit" disabled={isPending}>
								{isPending ? "Creating..." : "Create Workspace"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
