"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useMemo } from "react";

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
import { createWorkspace } from "./workspaceServerAction";
import { useRouter } from "next/navigation";
import { WorkspaceSchema } from "./workspaceSchema";

export default function WorkspacePage() {
	const router = useRouter();
	const [formState, formAction, isPending] = useActionState(createWorkspace, {
		errors: null,
		data: null,
	});

	const defaultValues = useMemo(() => {
		return (
			formState?.data || {
				name: "",
				description: "",
			}
		);
	}, [formState]);

	console.log(formState);

	const form = useForm({
		resolver: zodResolver(WorkspaceSchema),
		defaultValues,
	});

	const {
		register,
		formState: { errors },
	} = form;

	useEffect(() => {
		if (formState?.errors) {
			// Set field errors
			Object.entries(formState.errors).forEach(([field, messages]) => {
				form.setError(field, {
					type: "server",
					message: Array.isArray(messages) ? messages[0] : messages,
				});
			});

			// Reset with values but keep errors
			if (formState.data) {
				form.reset(formState.data, {
					keepErrors: true, // ✅ keeps the just-set errors
				});
			}
		} else if (formState?.type === "success" && formState.redirectTo) {
			router.push(formState.redirectTo);
		}
	}, [formState, form, router]);

	return (
		<div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
			<h1 className="text-4xl font-bold tracking-tight">No workspace found</h1>
			<p className="text-muted-foreground max-w-md">
				You haven’t created any workspaces yet. Workspaces help you organize
				your projects, tasks, and teams in one place.
			</p>

			<Dialog>
				<DialogTrigger asChild>
					<Button size="lg">Create Your First Workspace</Button>
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
