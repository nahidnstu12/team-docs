"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { useActionState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { assignPermissionsToRole } from "@/system/Actions/RolePermissionAssignActions";
import { Loader2 } from "lucide-react";
import { getAllPermissions } from "./action/getAllPermissions";

export default function RolePermissionDialog({ isOpen, onOpenChange, roleId }) {
	// State management
	const [permissions, setPermissions] = useState([]);
	const [permissionsPending, startPermissionsTransition] = useTransition();
	const hasFetchedPermissions = useRef(false);

	// Form management with React Hook Form
	const { reset, control, setError } = useForm({
		defaultValues: { permissions: [] },
	});

	// Form submission action
	const [formState, formAction, isSubmitting] = useActionState(
		assignPermissionsToRole,
		{
			errors: null,
			data: null,
		}
	);

	// Handle form state changes (success, error)
	useEffect(() => {
		if (formState?.success === false) {
			if (formState.errors?._form) toast.error(formState.errors._form[0]);
			formState.errors?.permissions?.forEach((msg) =>
				setError("permissions", { message: msg })
			);
		}

		if (formState?.type === "success") {
			toast.success("Permissions assigned successfully.");
			onOpenChange(false);
			reset();
		}
	}, [formState, reset, setError, onOpenChange]);

	// Fetch permissions only when dialog opens and not already fetched
	useEffect(() => {
		console.log(hasFetchedPermissions.current);
		const fetchPermissions = async () => {
			try {
				const perms = await getAllPermissions(roleId);
				startPermissionsTransition(() => setPermissions(perms));
			} catch (error) {
				console.error("Failed to fetch permissions:", error);
			}
		};

		if (!hasFetchedPermissions.current) {
			hasFetchedPermissions.current = true; // 🛡️ Lock fetching immediately
			fetchPermissions();
		}

		// Reset when dialog closes
		if (!isOpen) {
			setPermissions([]);
			reset({ permissions: [] });
			hasFetchedPermissions.current = false; // 🔓 Unlock fetch permission
		}
	}, [roleId, isOpen, reset]);

	// Update form permissions if permissions data changes
	useEffect(() => {
		reset({
			permissions: permissions
				.filter((perm) => perm.checked)
				.map((perm) => perm.id),
		});
	}, [permissions, reset]);

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

				{permissionsPending ? (
					<div className="h-[410px] flex flex-col items-center justify-center space-y-4 p-4 border rounded-xl">
						<Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
						<p className="text-xl font-medium text-muted-foreground">
							Fetching permissions...
						</p>
					</div>
				) : (
					<form action={formAction} className="space-y-2">
						{/* Hidden input to pass roleId */}
						<input type="hidden" name="roleId" value={roleId} />

						{/* Permissions checkboxes */}
						<div className="flex flex-wrap gap-4 content-start h-[300px] overflow-y-auto p-4 border rounded-xl">
							{permissions.map((perm) => (
								<Controller
									key={perm.id}
									control={control}
									name="permissions"
									render={({ field: { value, onChange } }) => {
										const isChecked = value?.includes(perm.id);

										const handleToggle = () => {
											if (isChecked) {
												onChange(value.filter((id) => id !== perm.id));
											} else {
												onChange([...(value || []), perm.id]);
											}
										};

										return (
											<Label className="flex items-start gap-3 p-4 border rounded-lg shadow-sm bg-muted hover:bg-muted/70 w-full sm:w-[48%] lg:w-[30%] h-[64px] overflow-hidden">
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

						{/* Form submit button */}
						<DialogFooter className="pt-6">
							<Button
								type="submit"
								disabled={isSubmitting}
								className="px-8 text-lg font-semibold h-14"
							>
								{isSubmitting ? "Assigning..." : "Assign Selected Permissions"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
