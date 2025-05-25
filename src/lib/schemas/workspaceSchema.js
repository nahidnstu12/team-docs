import { z } from "zod";

export const WorkspaceSchema = z.object({
	name: z.string().min(3, "Workspace name must be at least 3 characters."),
	slug: z.string().min(1, "Workspace Website URL is Required"),
	description: z
		.string()
		.optional()
		.refine(
			(val) => !val || val.length >= 10,
			"Description must be at least 10 characters."
		),
});
