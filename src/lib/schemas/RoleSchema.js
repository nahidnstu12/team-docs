import { z } from "zod";

export const RoleSchema = z.object({
	name: z.string().min(1, "Role name is required"),
	description: z
		.string()
		.optional()
		.refine(
			(val) => !val || val.length >= 10,
			"Description must be at least 10 characters."
		),
});
