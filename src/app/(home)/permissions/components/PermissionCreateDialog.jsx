"use client";

import { useCallback, useMemo } from "react";
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
import { createPermissions } from "@/system/Actions/PermissionActions";
import { PermissionSchema } from "@/lib/schemas/PermissionSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";

export default function PermissionCreateDialog({
	isDialogOpen,
	setIsDialogOpen,
	setStartFetchPermissions,
}) {
	const router = useRouter();

	const defaultValues = useMemo(() => {
		({
			name: "",
			description: "",
			scope: "",
		});
	}, []);

	const successToast = useMemo(
		() => ({
			title: "Permission created successfully",
			description: "Your new Permission is ready to use!",
		}),
		[]
	);

	const handleSuccess = useCallback(
		(redirectTo) => {
			setIsDialogOpen(false);
			setStartFetchPermissions(true);
			if (redirectTo) router.push(redirectTo);
		},
		[router, setIsDialogOpen, setStartFetchPermissions]
	);

	const { register, errors, formAction, isPending } = useServerFormAction({
		schema: PermissionSchema,
		actionFn: createPermissions,
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
								{isPending ? "Creating..." : "Create Permission"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
