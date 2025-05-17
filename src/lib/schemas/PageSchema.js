import { z } from "zod";

export const PageSchema = z.object({
	title: z.string().min(3, "Page title must be at least 3 characters"),
	description: z
		.string()
		.optional()
		.refine(
			(val) => !val || val.length >= 10,
			"Description must be at least 10 characters."
		),
	sectionId: z.string().optional(), // actually required. but real time validation is not working. so i had to optional it
});
