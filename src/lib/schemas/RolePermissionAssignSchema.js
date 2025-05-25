import { z } from "zod";

export const RolePermissionAssignSchema = z.object({
	roleId: z.string().min(1, "Role ID is required"),
	permissions: z
		.union([
			z.array(z.string()),
			z.string(),
			z.null(),
			z.undefined(), // if form input is missing
		])
		.transform((val) => {
			if (!val) return [];
			if (typeof val === "string") return [val];
			return val;
		}),
});
