import { z } from "zod";

export const PermissionSchema = z.object({
	name: z.string().min(3, "permission Name must be at least 3 characters"),
	scope: z
		.string()
		.min(3, "permission scope name must be at least 3 characters"),
	description: z
		.string()
		.optional()
		.refine(
			(val) => !val || val.length >= 10,
			"Description must be at least 10 characters."
		),
});
