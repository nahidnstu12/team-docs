"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { assignPermissionsToRole } from "@/system/Actions/RolePermissionAssignActions";
import { Loader2 } from "lucide-react";
import { useServerFormAction } from "@/hooks/useServerFormAction";
import { RolePermissionAssignSchema } from "@/lib/schemas/RolePermissionAssignSchema";
import { useRolePermissions } from "./hooks/useRolePermissions";

export default function RolePermissionDialog({ isOpen, onOpenChange, roleId }) {
	const defaultValues = useMemo(
		() => ({
			permissions: [],
		}),
		[]
	);

	const successToast = useMemo(
		() => ({
			title: "Permissions assigned successfully.",
			description: "",
		}),
		[]
	);

	const handleSuccess = useCallback(() => {
		onOpenChange(false);
	}, [onOpenChange]);

	const { control, reset, formAction, isPending } = useServerFormAction({
		schema: RolePermissionAssignSchema,
		actionFn: assignPermissionsToRole,
		defaultValues,
		successToast,
		onSuccess: handleSuccess,
	});

	const { permissions, showSkeleton } = useRolePermissions(
		roleId,
		isOpen,
		reset
	);

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

				{showSkeleton ? (
					<div className="h-[410px] flex flex-col items-center justify-center space-y-4 p-4 border rounded-xl">
						<Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
						<p className="text-xl font-medium text-muted-foreground">
							Fetching permissions...
						</p>
					</div>
				) : permissions.length === 0 ? (
					<div className="h-[410px] flex flex-col items-center justify-start space-y-4 p-4 border-2 border-dashed rounded-xl text-center ">
						<div className="flex flex-col items-center justify-center w-full gap-3 h-1/2">
							<h2 className="text-2xl font-bold text-muted-foreground">
								No Permissions Found
							</h2>
						</div>
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
