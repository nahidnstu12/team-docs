"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useActionState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { assignPermissionsToRole } from "@/system/Actions/RolePermissionAssignActions";
import { Loader2 } from "lucide-react";

export default function RolePermissionDialog({ isOpen, onOpenChange, roleId }) {
	const [formState, formAction, isPending] = useActionState(
		assignPermissionsToRole,
		{ errors: null, data: null }
	);

	const { register, handleSubmit, reset, setError } = useForm();

	const [permissions, setPermissions] = useState([]);
	const [loading, setLoading] = useState(false);

	console.log(formState);

	useEffect(() => {
		if (isOpen) {
			setLoading(true);
			import("@/app/(home)/role-permission-assign/loader/getAllPermissions")
				.then((mod) => mod.getAllPermissions())
				.then(setPermissions)
				.catch(() => toast.error("Failed to load permissions"))
				.finally(() => setLoading(false));
		}
	}, [isOpen]);

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

				<form action={formAction} className="space-y-8">
					{loading ? (
						<div className="flex flex-col items-center justify-center h-[300px] space-y-4">
							<Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
							<p className="text-xl font-medium text-muted-foreground">
								Fetching permissions...
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-4 border rounded-xl">
							<input type="hidden" name="roleId" value={roleId} />
							{permissions.map((perm) => (
								<Label
									key={perm.id}
									className="flex items-center gap-3 p-4 transition border rounded-lg shadow-sm bg-muted hover:bg-muted/70"
								>
									<Checkbox
										id={`perm-${perm.id}`}
										{...register(`${perm.id}`)}
										name="permissions"
										value={perm.id}
										className="scale-110"
									/>
									{perm.name}
								</Label>
							))}
						</div>
					)}

					<DialogFooter className="pt-6">
						<Button
							type="submit"
							disabled={isPending || loading}
							className="px-8 text-lg font-semibold h-14"
						>
							{isPending ? "Assigning..." : "Assign Selected Permissions"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
