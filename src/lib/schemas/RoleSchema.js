import { z } from "zod";

export const RoleSchema = z.object({
	name: z.string().min(3, "Role Name must be at least 3 characters"),
	description: z
		.string()
		.optional()
		.refine(
			(val) => !val || val.length >= 10,
			"Description must be at least 10 characters."
		),
});
