// app/workspaces/actions.js

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { workspaceSchema } from "./schema";
import prisma from "@/lib/prisma";

export async function createWorkspace(prevState, formData) {
	const validatedFields = workspaceSchema.safeParse({
		name: formData.get("name"),
		description: formData.get("description"),
	});

	if (!validatedFields.success) {
		return {
			values: {
				name: formData.get("name"),
				description: formData.get("description"),
			},
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	try {
		await prisma.workspace.create({
			data: {
				name: validatedFields.data.name,
				description: validatedFields.data.description,
				slug: validatedFields.data.name,
			},
		});
	} catch (error) {
		console.log(error, "--xxx--");
		return {
			values: {
				name: formData.get("name"),
				description: formData.get("description"),
			},
			errors: {
				server: "Failed to create workspace ---server",
			},
		};
	}

	revalidatePath("/roles");
	redirect("/roles");
}

export async function updateWorkspace(prevState, formData) {
	const validatedFields = workspaceSchema.safeParse({
		id: formData.get("id"),
		name: formData.get("name"),
		description: formData.get("description"),
	});

	if (!validatedFields.success) {
		return {
			values: {
				name: formData.get("name"),
				description: formData.get("description"),
			},
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	try {
		await prisma.workspace.update({
			where: { id: validatedFields.data.id },
			data: validatedFields.data,
		});
	} catch (error) {
		return {
			values: {
				name: formData.get("name"),
				description: formData.get("description"),
			},
			errors: {
				server: "Failed to update workspace",
			},
		};
	}

	revalidatePath("/roles");
	redirect("/roles");
}

export async function deleteWorkspace(id) {
	try {
		await prisma.workspace.delete({
			where: { id },
		});
		revalidatePath("/roles");
	} catch (error) {
		throw new Error("Failed to delete workspace");
	}
}
