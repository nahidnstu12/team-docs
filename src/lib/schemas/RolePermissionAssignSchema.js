import { z } from "zod";

export const RolePermissionAssignSchema = z.object({
	roleId: z.string().min(1, "Role ID is required"),
	permissions: z.array(z.string()).min(1, {
		message: "You must select at least one permission.",
	}),
});
