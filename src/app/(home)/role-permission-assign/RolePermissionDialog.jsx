"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useActionState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { assignPermissionsToRole } from "@/system/Actions/RolePermissionAssignActions";
import { Loader2 } from "lucide-react";

export default function RolePermissionDialog({
	isOpen,
	onOpenChange,
	roleId,
	permissions,
}) {
	const [formState, formAction, isPending] = useActionState(
		assignPermissionsToRole,
		{ errors: null, data: null }
	);

	const defaultValues = {
		permissions: permissions
			.filter((perm) => perm.checked)
			.map((perm) => perm.id),
	};

	const { reset, setError, control } = useForm({
		defaultValues,
	});

	// Update form when permissions or role changes
	useEffect(() => {
		reset({
			permissions: permissions
				.filter((perm) => perm.checked)
				.map((perm) => perm.id),
		});
	}, [permissions, reset, roleId]);

	useEffect(() => {
		if (!isOpen) {
			reset({ permissions: [] });
		}
	}, [isOpen, reset]);

	useEffect(() => {
		if (formState?.success === false) {
			if (formState.errors?._form) toast.error(formState.errors._form[0]);

			formState.errors?.permissions?.forEach((msg) =>
				setError("permissions", { message: msg })
			);
		}
		if (formState?.type === "success") {
			onOpenChange(false);
			toast.success("Permissions assigned successfully.");
			reset();
		}
	}, [formState, reset, setError, onOpenChange]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[1000px] max-h-[95vh] overflow-y-auto p-10 rounded-2xl shadow-xl">
				<DialogHeader>
					<DialogTitle className="text-3xl font-extrabold">
						Assign Permissions
					</DialogTitle>
					<DialogDescription className="text-lg text-muted-foreground">
						Choose the permissions you want to assign to this role.
					</DialogDescription>
				</DialogHeader>

				{permissions.length === 0 ? (
					<div className="h-[410px] p-4 border rounded-xl flex flex-col items-center justify-center space-y-4">
						<Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
						<p className="text-xl font-medium text-muted-foreground">
							Fetching permissions...
						</p>
					</div>
				) : (
					// <form key={roleId} action={formAction} className="space-y-8">
					<form action={formAction} className="space-y-8">
						<div className="flex content-start flex-wrap gap-4 h-[300px] overflow-y-auto p-4 border rounded-xl">
							<input type="hidden" name="roleId" value={roleId} />
							{permissions.map((perm) => (
								<Controller
									key={perm.id}
									control={control}
									name="permissions"
									render={({ field: { value, onChange } }) => {
										const isChecked = value?.includes(perm.id);

										// Toggle selected permission manually
										const handleToggle = () => {
											if (isChecked) {
												onChange(value.filter((id) => id !== perm.id));
											} else {
												onChange([...(value || []), perm.id]);
											}
										};

										return (
											<Label
												key={perm.id}
												className="flex items-start gap-3 p-4 border rounded-lg shadow-sm bg-muted hover:bg-muted/70 w-full sm:w-[48%] lg:w-[30%] h-[64px] overflow-hidden"
											>
												<Checkbox
													name="permissions"
													value={perm.id}
													id={`perm-${perm.id}`}
													checked={isChecked}
													onCheckedChange={handleToggle}
													className="mt-1 scale-110"
												/>
												<span className="text-sm font-medium leading-snug line-clamp-2">
													{perm.name}
												</span>
											</Label>
										);
									}}
								/>
							))}
						</div>

						<DialogFooter className="pt-6">
							<Button
								type="submit"
								disabled={isPending}
								className="px-8 text-lg font-semibold h-14"
							>
								{isPending ? "Assigning..." : "Assign Selected Permissions"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
