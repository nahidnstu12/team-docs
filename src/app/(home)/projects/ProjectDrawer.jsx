"use client";

import { Button } from "@/components/ui/button";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { createProjectAction } from "@/system/Actions/ProjectActions";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
} from "@heroui/drawer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";

export default function ProjectDrawer({ isOpen, onOpenChange }) {
	const router = useRouter();

	// ✅ Prevent multiple toast re-fires after a successful form submit
	const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

	// 🔄 Holds a *snapshot* of the form action result so we can manage lifecycle
	const [localFormState, setLocalFormState] = useState(null);

	// 📦 React Hook Form + Zod validation schema setup
	const form = useForm({
		resolver: zodResolver(ProjectSchema),
		defaultValues: {
			name: "",
			slug: "",
			description: "",
		},
	});

	const {
		register,
		watch,
		setValue,
		reset,
		setError,
		formState: { errors },
	} = form;

	// 🔁 Server action with form submission state tracking
	const [formState, formAction, isPending] = useActionState(
		createProjectAction,
		{ data: null, errors: null }
	);

	// 👀 Watch fields for dynamic behavior
	const nameValue = watch("name");
	const slugValue = watch("slug");

	// 🧠 Auto-generate slug when name changes (only when drawer is open)
	useEffect(() => {
		if (!isOpen) return;

		if (nameValue) {
			const slug = slugify(nameValue, {
				lower: true,
				strict: true,
				remove: /[*+~.()'"!:@]/g,
			});
			setValue("slug", slug);
		} else {
			setValue("slug", "");
		}
	}, [nameValue, setValue, isOpen]);

	// 🧼 Copy the result from the server action into local state to control behavior
	useEffect(() => {
		if (formState) {
			setLocalFormState(formState);
		}
	}, [formState]);

	// 🔄 Handle server response (success or error)
	useEffect(() => {
		if (!localFormState || hasHandledSuccess) return;

		// 💥 Handle validation/server errors
		if (localFormState?.errors) {
			Object.entries(localFormState.errors).forEach(([field, message]) => {
				setError(field, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});
				if (field === "_form") {
					toast.error(message[0]);
				}
			});

			if (localFormState.data) {
				reset(localFormState.data, { keepErrors: true });
			}
		}

		// ✅ On success: show toast, reset form, close drawer, clean state
		if (localFormState?.type === "success") {
			setHasHandledSuccess(true);

			toast.success("Project created successfully", {
				description: "Your new project is ready to use!",
			});

			reset(); // Clear form fields
			setTimeout(() => {
				setLocalFormState(null); // 🔄 Destroy local state so toast doesn't show again
			}, 500);

			onOpenChange(false); // ❌ Close drawer
		}

		router.refresh(); // 🔃 Refresh router state if needed (ex. for server components)
	}, [
		localFormState,
		reset,
		onOpenChange,
		setError,
		hasHandledSuccess,
		router,
	]);

	// 🔁 When drawer opens: reset everything for a clean slate
	useEffect(() => {
		if (isOpen) {
			reset({
				name: "",
				slug: "",
				description: "",
			}); // Clear form
			setHasHandledSuccess(false); // Allow new success
			setLocalFormState(null); // Clear any lingering success
		}
	}, [isOpen, reset]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6 text-center">
			<Drawer
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				backdrop="opaque"
				isDismissable
			>
				<DrawerContent className="fixed top-0 right-0 z-50 w-full h-screen max-w-md bg-white border-l border-gray-200 shadow-lg">
					<form action={formAction} className="flex flex-col h-full">
						<DrawerHeader className="flex items-center justify-start border-b border-gray-200">
							<h2 className="text-xl font-semibold text-gray-900">
								Create New Project
							</h2>
						</DrawerHeader>

						<DrawerBody className="flex-1 px-6 py-8 space-y-6 overflow-y-auto">
							{/* Name */}
							<div>
								<label className="block mb-1 text-sm font-medium text-gray-700">
									Project Name
								</label>
								<input
									{...register("name")}
									placeholder="E.g. Internal CRM"
									aria-invalid={!!errors.name}
									className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 ${
										errors.name ? "border-red-500" : "border-gray-300"
									}`}
								/>
								{errors.name && (
									<p className="mt-1 text-sm text-red-500">
										{errors.name.message}
									</p>
								)}
							</div>

							{/* Slug */}
							<div>
								<label className="block mb-1 text-sm font-medium text-gray-700">
									Project URL
								</label>
								<input
									{...register("slug")}
									readOnly
									className="w-full px-4 py-2 text-gray-500 bg-gray-100 border border-gray-200 rounded-md"
								/>
								<p className="mt-1 text-xs text-gray-500">
									This will be your project&apos;s URL identifier.
								</p>
								{errors.slug && (
									<p className="mt-1 text-sm text-red-500">
										{errors.slug.message}
									</p>
								)}
							</div>

							{/* Description */}
							<div>
								<label className="block mb-1 text-sm font-medium text-gray-700">
									Description
								</label>
								<textarea
									{...register("description")}
									rows={6}
									placeholder="Describe your project's purpose and goals..."
									className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 ${
										errors.description ? "border-red-500" : "border-gray-300"
									}`}
								/>
								{errors.description && (
									<p className="mt-1 text-sm text-red-500">
										{errors.description.message}
									</p>
								)}
							</div>
						</DrawerBody>

						{/* Global Error */}
						{errors._form && (
							<div className="p-2 mb-2 border-l-2 border-red-500 bg-red-50">
								<p className="text-red-700">{errors._form.message}</p>
							</div>
						)}

						<DrawerFooter className="flex justify-end px-6 py-4 space-x-3 border-t border-gray-200">
							<Button type="submit" disabled={!slugValue || isPending}>
								{isPending ? "Creating..." : "Create Project"}
							</Button>
						</DrawerFooter>
					</form>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
