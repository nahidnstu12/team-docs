"use client";

import { Button } from "@/components/ui/button";
import { useServerFormAction } from "@/hook/useServerFormAction";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { createProjectAction } from "@/system/Actions/ProjectActions";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
} from "@heroui/drawer";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import slugify from "slugify";

export default function ProjectDrawer({
	isDrawerOpen,
	setIsDrawerOpen,
	setStartFetchProjects,
}) {
	const router = useRouter();
	const hasShownToastRef = useRef(false);

	// ✅ Use your custom server form action hook
	const { register, watch, setValue, reset, errors, formAction, isPending } =
		useServerFormAction({
			schema: ProjectSchema,
			actionFn: createProjectAction,
			defaultValues: {
				name: "",
				slug: "",
				description: "",
			},
			onSuccess: () => {
				if (hasShownToastRef.current) return;
				hasShownToastRef.current = true;

				reset(); // Clear form fields
				setIsDrawerOpen(false); // Close drawer
				setStartFetchProjects(true); // Tell parent to refetch projects
				router.refresh(); // Refresh router
				setTimeout(() => {
					hasShownToastRef.current = false;
				}, 500);
			},
			onError: () => {
				// No need to do anything special here; the hook already displays server errors
			},
			onSettled: () => {
				// Can be used for extra cleanup if needed
			},
		});

	const nameValue = watch("name");
	const slugValue = watch("slug");

	// ✅ Auto-generate slug
	useEffect(() => {
		if (!isDrawerOpen || !nameValue) return;
		setValue(
			"slug",
			slugify(nameValue, {
				lower: true,
				strict: true,
				remove: /[*+~.()'"!:@]/g,
			})
		);
	}, [nameValue, setValue, isDrawerOpen]);

	// ✅ Reset form cleanly when drawer opens
	useEffect(() => {
		if (isDrawerOpen) {
			reset({
				name: "",
				slug: "",
				description: "",
			});
		}
	}, [isDrawerOpen, reset]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6 text-center">
			<Drawer
				isOpen={isDrawerOpen}
				onOpenChange={setIsDrawerOpen}
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
