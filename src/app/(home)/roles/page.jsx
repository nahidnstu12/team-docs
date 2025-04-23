"use client";
import { useActionState, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RoleSchema } from "@/lib/schemas/RoleSchema";
import { createRole } from "@/system/Actions/RoleAction";

export default function RolePage() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	// Simulating createRole API call
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

	// Reset on open
	useEffect(() => {
		if (isOpen) {
			reset({
				name: "",
				description: "",
			});
		}
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
			setIsOpen(false);
			reset();
			toast.success("Role created successfully", {
				description: "Your new role is ready to use!",
			});
			if (formState.redirectTo) {
				router.push(formState.redirectTo);
			}
		}
	}, [formState, setError, reset, router]);

	return (
		<>
			<Button onClick={() => setIsOpen(true)} className="mb-4">
				Create Role
			</Button>

			<Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
				<DialogTrigger asChild>
					{/* Hidden trigger: manually triggered by card or button */}
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
