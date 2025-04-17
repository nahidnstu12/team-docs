"use server";

import prisma from "@/lib/prisma";
import { WorkspaceSchema } from "./workspaceSchema";

export async function createWorkspace(prevState, formData) {
	const rawData = Object.fromEntries(formData);
	const result = WorkspaceSchema.safeParse(rawData);

	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
			data: rawData,
		};
	}

	const slug = result.data.name.replaceAll(" ", "-");

	await prisma.workspace.create({
		data: {
			name: result.data.name,
			description: result.data?.description,
			slug,
		},
	});

	return {
		type: "success",
		redirectTo: "/home", // example
	};
}
