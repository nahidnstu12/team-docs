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
import { createRole } from "@/system/Actions/RoleActions";
import { RoleSchema } from "@/lib/schemas/RoleSchema";

export default function RoleCreateForm({ isOpen, onOpenChange }) {
	const router = useRouter();

	const [formState, formAction, isPending] = useActionState(createRole, {
		errors: null,
		data: null,
	});

	const {
		register,
		setError,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(RoleSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	useEffect(() => {
		if (!formState) return;

		if (formState.success === false && formState.data) {
			// Repopulate form fields from server-provided values
			reset(formState.data);
			Object.entries(formState.errors || {}).forEach(([field, message]) => {
				setError(field, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});
			});
			if (formState.errors?._form) {
				toast.error(formState.errors._form[0]);
			}
			return;
		}

		if (formState.type === "success") {
			onOpenChange(false);
			reset({ name: "", description: "" });
			toast.success("Role created successfully", {
				description: "Your new role is ready to use!",
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
							Create a New Role
						</DialogTitle>
						<DialogDescription>
							Provide a name and optional description for the new role in your
							system.
						</DialogDescription>
					</DialogHeader>

					<form action={formAction} className="mt-6 space-y-5">
						<div className="space-y-1.5">
							<Label htmlFor="name">Role Name</Label>
							<Input
								id="name"
								placeholder="e.g. Admin, Editor, Moderator"
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
								placeholder="What is this role about?"
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
