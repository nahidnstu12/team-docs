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
import { createUser } from "@/system/Actions/UserAction";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { useServerFormAction } from "@/hooks/useServerFormAction";

export default function UserCreateDialog({
	isDialogOpen,
	setIsDialogOpen,
	setStartFetchUsers,
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
			title: "User created successfully",
			description: "Your new User is ready to use!",
		}),
		[]
	);

	const handleSuccess = useCallback(
		(redirectTo) => {
			setIsDialogOpen(false);
			    setStartFetchUsers(true);
			if (redirectTo) router.push(redirectTo);
		},
		[router, setIsDialogOpen, setStartFetchUsers]
	);

	const { register, errors, formAction, isPending, isSubmitDisabled } =
		useServerFormAction({
			schema: UserSchema,
			actionFn: createUser,
			defaultValues,
			successToast,
			onSuccess: handleSuccess,
			isDialogOpen,
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
							Create a New User
						</DialogTitle>
						<DialogDescription>
							Provide a username, email and password for the new user in
							your system.
						</DialogDescription>
					</DialogHeader>

					<form action={formAction} className="mt-6 space-y-5">
						<div className="space-y-1.5">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								placeholder="e.g. johndoe"
								className="h-11"
								{...register("username")}
							/>
							{errors.username && (
								<p className="mt-1 text-sm text-red-500">
									{errors.username.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								placeholder="e.g. johndoe@example.com"
								className="h-11"
								{...register("email")}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-500">
									{errors.email.message}
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="password">Password</Label>
							<Textarea
								id="password"
								placeholder="e.g. password123"
								{...register("password")}
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-500">
									{errors.password.message}
								</p>
							)}
						</div>

						{errors._form && (
							<div className="p-4 mb-4 border-l-4 border-red-500 bg-red-50">
								<p className="text-red-700">{errors._form.message}</p>
							</div>
						)}

						<DialogFooter className="pt-4">
							<Button type="submit" disabled={isSubmitDisabled}>
								{isPending ? "Creating..." : "Create User"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
