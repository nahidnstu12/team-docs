import { z } from "zod";

export const UserSchema = z.object({
	username: z.string().min(3, "username must be at least 3 characters"),
	email: z
		.string()
		.min(3, "email must be at least 3 characters"),
	password: z
		.string()
		.optional()
		.refine(
			(val) => !val || val.length >= 10,
			"Password must be at least 10 characters."
		),
});
