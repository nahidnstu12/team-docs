import { z } from "zod";

export const workspaceSchema = z.object({
	name: z.string().min(3, "Name is smoll").max(100),
	description: z.string().max(500).optional(),
});
