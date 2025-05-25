"use client";

import { useEffect, useMemo, useRef } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";

import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { useServerFormAction } from "@/hooks/useServerFormAction";
import { ProjectSchema } from "@/lib/schemas/ProjectSchema";
import { createProjectAction } from "@/system/Actions/ProjectActions";
import { useDrawerLoadingStore } from "@/lib/stores/useDrawerLoadingStore";

export default function ProjectDrawer({
	isDrawerOpen,
	setIsDrawerOpen,
	setStartFetchProjects,
}) {
	const router = useRouter();

	// animate drawer loading spinner
	useEffect(() => {
		useDrawerLoadingStore.getState().markDrawerReady();
	}, []);

	const hasShownToastRef = useRef(false);

	const defaultValues = useMemo(
		() => ({
			name: "",
			slug: "",
			description: "",
		}),
		[]
	);

	const {
		register,
		watch,
		setValue,
		reset,
		errors,
		formAction,
		isPending,
		isSubmitDisabled,
	} = useServerFormAction({
		schema: ProjectSchema,
		actionFn: createProjectAction,
		defaultValues,
		onSuccess: () => {
			if (hasShownToastRef.current) return;
			hasShownToastRef.current = true;

			reset();
			setIsDrawerOpen(false);
			setStartFetchProjects(true);
			router.refresh();

			setTimeout(() => {
				hasShownToastRef.current = false;
			}, 500);

			// clean up drawer loading spinner state
			useDrawerLoadingStore.getState().resetDrawerLoading();
		},
	});

	const nameValue = watch("name");
	const slugValue = watch("slug");

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

	useEffect(() => {
		if (isDrawerOpen) {
			reset(defaultValues);
			// clean up drawer loading spinner state
			useDrawerLoadingStore.getState().resetDrawerLoading();
		}
	}, [isDrawerOpen, reset, defaultValues]);

	return (
		<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
			<DrawerContent
				side="right"
				className="w-full max-w-md min-h-screen ml-auto border-l shadow-xl"
			>
				<form action={formAction} className="flex flex-col h-full">
					<DrawerHeader>
						<DrawerTitle>Create New Project</DrawerTitle>
						<DrawerDescription>
							Start a new project to manage pages.
						</DrawerDescription>
					</DrawerHeader>

					<div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
						{/* Name Field */}
						<div>
							<label className="block mb-1 text-sm font-medium text-gray-700">
								Project Name
							</label>
							<input
								{...register("name")}
								placeholder="E.g. Internal CRM"
								aria-invalid={!!errors.name}
								className={`w-full px-4 py-2 rounded-md border ${
									errors.name ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-500">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Slug Field */}
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
								This will be your project’s URL identifier.
							</p>
							{errors.slug && (
								<p className="mt-1 text-sm text-red-500">
									{errors.slug.message}
								</p>
							)}
						</div>

						{/* Description Field */}
						<div>
							<label className="block mb-1 text-sm font-medium text-gray-700">
								Description
							</label>
							<textarea
								{...register("description")}
								rows={5}
								placeholder="Describe your project’s purpose..."
								className={`w-full px-4 py-2 rounded-md border ${
									errors.description ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.description && (
								<p className="mt-1 text-sm text-red-500">
									{errors.description.message}
								</p>
							)}
						</div>

						{/* Global Form Error */}
						{errors._form && (
							<div className="p-2 border-l-2 border-red-500 bg-red-50">
								<p className="text-sm text-red-700">{errors._form.message}</p>
							</div>
						)}
					</div>

					<DrawerFooter className="flex justify-end gap-3 px-6 py-4 border-t">
						<DrawerClose asChild>
							<Button type="button" variant="ghost">
								Cancel
							</Button>
						</DrawerClose>
						<Button type="submit" disabled={!slugValue || isSubmitDisabled}>
							{isPending ? "Creating..." : "Create Project"}
						</Button>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	);
}
