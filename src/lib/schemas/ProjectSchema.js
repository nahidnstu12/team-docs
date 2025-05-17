import { z } from "zod";

export const ProjectSchema = z.object({
	name: z.string().min(3, "Project Name must be at least 3 characters"),
	slug: z.string().min(1, "Project URL is Required"),
	description: z
		.string()
		.optional()
		.refine(
			(val) => !val || val.length >= 10,
			"Description must be at least 10 characters."
		),
});
