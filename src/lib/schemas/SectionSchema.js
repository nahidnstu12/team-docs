import { z } from "zod";

export const SectionSchema = z.object({
	name: z.string().min(3, "Section Name must be at least 3 characters"),
	description: z
		.string()
		.optional()
		.refine(
			(val) => !val || val.length >= 10,
			"Description must be at least 10 characters."
		),
	projectId: z.string().optional(), // actually required. but real time validation is not working. so i had to optional it
});
