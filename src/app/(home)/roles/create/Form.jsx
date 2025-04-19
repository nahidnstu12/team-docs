"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { createWorkspace } from "../actions";
import { workspaceSchema } from "../schema";

export default function CreateForm() {
	const [state, formAction, isPending] = useActionState(createWorkspace, {
		errors: {},
		values: {},
	});

	const {
		register,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(workspaceSchema),
	});

	useEffect(() => {
		if (state?.values) {
			reset(state.values);
		}
	}, [state, reset]);

	console.log(state);

	return (
		<form action={formAction} className="space-y-4">
			<div>
				<label htmlFor="name" className="block text-sm font-medium mb-1">
					Name
				</label>
				<input
					{...register("name")}
					id="name"
					className="w-full p-2 border rounded"
				/>
				{errors.name && (
					<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
				)}
				{state.errors?.name && (
					<p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
				)}
			</div>

			<div>
				<label htmlFor="description" className="block text-sm font-medium mb-1">
					Description (optional)
				</label>
				<textarea
					{...register("description")}
					id="description"
					className="w-full p-2 border rounded"
					rows={3}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm mt-1">
						{errors.description.message}
					</p>
				)}
				{state.errors?.description && (
					<p className="text-red-500 text-sm mt-1">
						{state.errors.description}
					</p>
				)}
			</div>

			<div className="flex space-x-3">
				<button
					type="submit"
					disabled={isPending}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
				>
					{isPending ? "Creating..." : "Create Workspace"}
				</button>
				<Link
					href="/roles"
					className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
				>
					Cancel
				</Link>
			</div>

			{state.errors?.server && (
				<p className="text-red-500 text-sm mt-2">{state.errors.server}</p>
			)}
		</form>
	);
}
