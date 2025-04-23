"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { useActionState } from "react"; // Next.js form action hook
import { createPermissions } from "@/system/Actions/PermissionActions";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";

export default function PermissionCreateForm({ isOpen, onOpenChange }) {
	const router = useRouter();

	const [formState, formAction, isPending] = useActionState(createPermissions, {
		errors: null,
		data: null,
	});

	const {
		register,
		setError,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(PermissionSchema),
		defaultValues: {
			name: "",
			description: "",
			scope: "",
		},
	});

	// Always reset with blank on open
	useEffect(() => {
		if (isOpen) {
			reset({ name: "", description: "", scope: "" });
		}
	}, [isOpen, reset]);

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
		}

		if (formState.type === "success") {
			onOpenChange(false);
			reset();
			toast.success("Permission created successfully", {
				description: "Your new permission is ready to use!",
			});
			if (formState.redirectTo) {
				return router.push(formState.redirectTo);
			}
		}
	}, [formState, setError, reset, router, onOpenChange]);

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogTrigger asChild>
					<div id="create-role-drawer-trigger" />
				</DialogTrigger>

				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle className="text-2xl font-semibold">
							Create a New Permission
						</DialogTitle>
						<DialogDescription>
							Provide a name and optional description for the new permission in
							your system.
						</DialogDescription>
					</DialogHeader>

					<form action={formAction} className="mt-6 space-y-5">
						<div className="space-y-1.5">
							<Label htmlFor="scope">Permission Scope</Label>
							<Input
								id="scope"
								placeholder="e.g. workspace, project, page"
								className="h-11"
								{...register("scope")}
							/>
							{errors.scope && (
								<p className="mt-1 text-sm text-red-500">
									{errors.scope.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="name">Permission Name</Label>
							<Input
								id="name"
								placeholder="e.g. create, update, delete, view"
								className="h-11"
								{...register("name")}
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-500">
									{errors.name.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="description">
								Description{" "}
								<span className="text-muted-foreground">(optional)</span>
							</Label>
							<Textarea
								id="description"
								placeholder="What is this permission about?"
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
							<Button type="submit" disabled={isPending}>
								{isPending ? "Creating..." : "Create Role"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
