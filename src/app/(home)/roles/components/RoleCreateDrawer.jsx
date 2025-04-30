"use client";

import { useRouter } from "next/navigation";

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
import { createRole } from "@/system/Actions/RoleActions";
import { RoleSchema } from "@/lib/schemas/RoleSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { useCallback, useMemo } from "react";

export default function RoleCreateDrawer({
	isDialogOpen,
	setIsDialogOpen,
	setShouldStartFetchRoles,
}) {
	const router = useRouter();

	const defaultValues = useMemo(
		() => ({
			name: "",
			description: "",
		}),
		[]
	);

	const successToast = useMemo(
		() => ({
			title: "Role created successfully",
			description: "Your new role is ready to use!",
		}),
		[]
	);

	const handleSuccess = useCallback(
		(redirectTo) => {
			setIsDialogOpen(false);
			setShouldStartFetchRoles(true);
			if (redirectTo) router.push(redirectTo);
		},
		[router, setIsDialogOpen, setShouldStartFetchRoles]
	);

	const { register, errors, formAction, isPending } = useServerFormAction({
		schema: RoleSchema,
		actionFn: createRole,
		defaultValues,
		successToast,
		onSuccess: handleSuccess,
	});

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
