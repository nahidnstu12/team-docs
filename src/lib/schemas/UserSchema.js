import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .min(3, "Email must be at least 3 characters")
    .email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  status: z.string().default("ACTIVE").optional(),
});

export const RegistrationUserSchema = UserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

// admin Updating user
export const AdminUpdatingUserSchema = UserSchema.extend({
  status: z.string().optional(),
});
